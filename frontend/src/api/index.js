export function fetchBackTranslate(AASeq,minGC,maxGC){
  return fetch("/api/backtranslate",
        { 
          method: 'POST',
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify({
            SEQUENCE:AASeq,
            GC_LOWER_BOUND:minGC,
            GC_UPPER_BOUND:maxGC
          })
        })
    .then( resp=> resp.json() )
}

export function fetchAminoAcidInfoFromAPI(AASeq){
  let p = new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve({ AMINO_ACID_SEQUENCE_INFO: { SEQUENCE:"AAA",
                                            GC_MAX: 0.8,
                                            GC_MIN: 0.2,
                                            AA_ID: 0 
                                            },
                NUCLEOTIDE_SEQUENCES: [{SEQUENCE: "ATTATTATT",
                                        GC_CONTENT: 0.1,
                                        NT_ID: 0
                                        },
                                       {SEQUENCE: "ATTATGATG",
                                        GC_CONTENT: 0.8,
                                        NT_ID: 1
                                        },
                                       {SEQUENCE: "ATTATCATC",
                                        GC_CONTENT: 0.5,
                                        NT_ID: 2
                                        }
                                        ]
                });
    }, 1000);
  });

  return p;
  //~ return fetch("/api/aminoacid",
        //~ { 
          //~ method: 'POST',
          //~ headers: {
            //~ "Content-type": "application/json"
          //~ },
          //~ body: JSON.stringify({
            //~ AMINO_ACID_SEQUENCE:AASeq
          //~ })
        //~ })
    //~ .then( resp=> resp.json() )
}

export function generateAndFetchBackTranslation(AASeq,GCLowerBound,GCUpperBound){
  let p = new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve({ AMINO_ACID_SEQUENCE_INFO: { SEQUENCE:"AAA",
                                            GC_MAX: 0.8,
                                            GC_MIN: 0.2,
                                            AA_ID: 0 
                                            },
                NUCLEOTIDE_SEQUENCES: [{SEQUENCE: "ATTATTATT",
                                        GC_CONTENT: 0.1,
                                        NT_ID: 0
                                        },
                                       {SEQUENCE: "ATTATGATG",
                                        GC_CONTENT: 0.8,
                                        NT_ID: 1
                                        },
                                       {SEQUENCE: "ATTATCATC",
                                        GC_CONTENT: 0.5,
                                        NT_ID: 2
                                        },
                                       {SEQUENCE: "ATGATCATC",
                                        GC_CONTENT: 0.6,
                                        NT_ID: 3
                                        }
                                        ]
                });
    }, 1000);
  });

  return p;
  
  //~ return fetch("/api/backtranslate",
        //~ { 
          //~ method: 'POST',
          //~ headers: {
            //~ "Content-type": "application/json"
          //~ },
          //~ body: JSON.stringify({
            //~ AMINO_ACID_SEQUENCE:AASeq,
            //~ GC_LOWER_BOUND:GCLowerBound,
            //~ GC_UPPER_BOUND:GCUpperBound
          //~ })
        //~ })
    //~ .then( resp=> resp.json() )
}
