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
