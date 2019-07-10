# Project-Back-Translation

## Install
```
git clone https://github.com/zhoulytwinyu/Project-Back-Translation.git
cd Project-Back-Translation
PROJECT_NAME="project-back-translation"
docker build . -t $PROJECT_NAME
docker run -p 5000:80  -it $PROJECT_NAME
```

## Accepted input
A sequence of __capitalized__, __non-degnerative__, __single-letter__ encoding amino acids:

A, R, N, D, B, C, E, Q, Z, G, H, I, L, K, M, F, P, S, T, W, Y, V and * (stop codon)

Any other characters including white spaces, lowercase letters etc input will cause error.

## Known issues
* Input sanitization. Both the front and backend do not check amino acid sequence input. If a invalid amino acid sequence is given, the webpage will go down in 500 error.


## TODO
sqlite3 database to persistently store back-translated nucleotide sequence.
