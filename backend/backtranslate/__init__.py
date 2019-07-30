#!/usr/bin/env python
from collections import Counter
from bisect import bisect_left,bisect_right
from random import sample, shuffle
import pkg_resources

CODON_FILE = pkg_resources.resource_filename(__name__, 'data/standard_codon.tsv')

def memoize_one(func):
  memory = {"args":None,
            "result":None}
  def new_func(*args):
    if memory["args"] != args:
      memory["args"] = args
      memory["result"] = func(*args)
    return memory["result"]
  return new_func

@memoize_one
def get_amino_acid_to_codon_map():
  ret = {}
  fh = open(CODON_FILE)
  for l in fh:
    aa,cds = l.strip().split('\t')
    ret[aa]=cds.split(',')
  return ret

@memoize_one
def get_all_amino_acid_set():
  codon_map = get_amino_acid_to_codon_map()
  ret = set(codon_map.keys())
  return ret

@memoize_one
def get_codon_gc_map():
  ret = {}
  codon_map = get_amino_acid_to_codon_map()
  for cds in codon_map.values():
    for cd in cds:
      ret[cd] = get_gc_content(cd)
  return ret

def get_gc_content(nt_seq):
  gc_count = 0
  gc = {'G','C'}
  for i in nt_seq:
    if i in gc:
      gc_count+=1
  return gc_count/len(nt_seq)

@memoize_one
def get_amino_acid_info_map():
  ret = {}
  codon_map = get_amino_acid_to_codon_map()
  for aa, cds in codon_map.items():
    codon_gc_pair = [(cd,get_gc_content(cd)) for cd in cds]
    possible_gcs = list(set([p[1] for p in codon_gc_pair]))
    gc_max = max(possible_gcs)
    gc_min = min(possible_gcs)
    gc_to_codon_map = {}
    for cd,gc in codon_gc_pair:
      tmp_list = gc_to_codon_map.get(cd,[])
      tmp_list.append(cd)
      gc_to_codon_map[gc] = tmp_list
    ret[aa] = { "GC_TO_CODON_MAP": gc_to_codon_map,
                "POSSIBLE_GCS": possible_gcs,
                "GC_MAX": gc_max,
                "GC_MIN": gc_min
                }
  return ret

def validate_amino_acid_sequence(aa_seq):
  assert( type(aa_seq)==str )
  if aa_seq=="":
    return false 
  all_aa = get_all_amino_acid_set()
  if set(aa_seq).issubset(all_aa):
    return True
  else:
    return False

def get_gc_max(aa_seq):
  info_map = get_amino_acid_info_map()
  gc_max = sum([info_map[aa]["GC_MAX"] for aa in aa_seq])/len(aa_seq)
  return gc_max

def get_gc_min(aa_seq):
  info_map = get_amino_acid_info_map()
  gc_min = sum([info_map[aa]["GC_MIN"] for aa in aa_seq])/len(aa_seq)
  return gc_min

def pick_codon(aa,target_gc):
  info_map = get_amino_acid_info_map()[aa]
  possible_gcs = info_map["POSSIBLE_GCS"]
  gc_to_codon_map = info_map["GC_TO_CODON_MAP"]
  diff = [abs(gc-target_gc) for gc in info_map["POSSIBLE_GCS"]]
  min_idx = diff.index(min(diff))
  chosen_gc = info_map["POSSIBLE_GCS"][min_idx]
  chosen_codon = sample(gc_to_codon_map[chosen_gc],1)[0]
  return chosen_codon

def back_translate_single_gc_target(aa_seq,target_gc):
  condom_gc_map = get_codon_gc_map()
  info_map = get_amino_acid_info_map()
  seq_length = len(aa_seq)
  aa_count = Counter(aa_seq)
  # Split amino acid into flexible and unflexible group
  # Unflexible group contains those AA that cannot by adjust GC around target_GC
  aa_count_inflexible = {}
  aa_count_flexible = {}
  for aa,count in aa_count.items():
    if  info_map[aa]["GC_MAX"]<target_gc or \
        info_map[aa]["GC_MIN"]>target_gc:
      aa_count_inflexible[aa] = count
    else:
      aa_count_flexible[aa] = count
  # Set up
  cur_target_gc = target_gc
  sum_gc=0
  back_translation_map = {}
  i=0
  # First, greedily choose codon for unflexible amino acid at random
  pick_sequence = []
  for aa,count in aa_count_inflexible.items():
    pick_sequence.extend([aa]*count)
  shuffle(pick_sequence)
  for aa in pick_sequence:
    cur_target_gc = (target_gc*seq_length-sum_gc)/(seq_length-i)
    # Pick codon for AA with the given target GC
    codon = pick_codon(aa,cur_target_gc)
    tmp_list = back_translation_map.get(aa,[])
    tmp_list.append(codon)
    back_translation_map[aa] = tmp_list
    # Update target GC
    gc = condom_gc_map[codon]
    sum_gc = gc+sum_gc
    i+=1
  # Second, greedily choose codon for flexible amino acid at random
  pick_sequence = []
  for aa,count in aa_count_flexible.items():
    pick_sequence.extend([aa]*count)
  shuffle(pick_sequence)
  for aa in pick_sequence:
    cur_target_gc = (target_gc*seq_length-sum_gc)/(seq_length-i)
    # Pick codon for AA with the given target GC
    codon = pick_codon(aa,cur_target_gc)
    tmp_list = back_translation_map.get(aa,[])
    tmp_list.append(codon)
    back_translation_map[aa] = tmp_list
    # Update target GC
    gc = condom_gc_map[codon]
    sum_gc = gc+sum_gc
    i+=1
  # Shuffle codon to provide some randomness
  for codons in back_translation_map.values():
    shuffle(codons)
  # Go through AA_seq and back_translate using back_translation_map
  ret = []
  for aa in aa_seq:
    ret.append(back_translation_map[aa].pop())
  return ret

def back_translate(aa_seq,gc_threshold_min,gc_threshold_max):
  target_gc = (gc_threshold_min+gc_threshold_max)/2
  return back_translate_single_gc_target(aa_seq,target_gc)

if __name__=="__main__":
  codon_seq = back_translate("MSKGEELFTGVVPILVELDGDVNGHKFSVSGEGEGDATYGKLTLKFICTTGKLPVPWPTLVTTFSYGVQCFSRYPDHMKQHDFFKSAMPEGYVQERTIFFKDDGNYKTRAEVKFEGDTLVNRIELKGIDFKEDGNILGHKLEYNYNSHNVYIMADKQKNGIKVNFKIRHNIEDGSVQLADHYQQNTPIGDGPVLLPDNHYLSTQSALSKDPNEKRDHMVLLEFVTAAGITHGMDELYK*",0.5,0.55)
  print(' '.join(codon_seq))
