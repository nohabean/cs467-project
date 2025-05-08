#!/bin/bash

export PATH=$PATH:"/c/Users/tehfu/AppData/Local/Google/Cloud SDK/google-cloud-sdk/bin"

gcloud builds submit --tag gcr.io/vital-house-457523-m6/listings-api .

gcloud run deploy listings-api \
  --image gcr.io/vital-house-457523-m6/listings-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars DB_HOST=35.224.8.223,DB_PORT=5432,DB_NAME=postgres,DB_USER=postgres,DB_PASSWORD='bQR7Fa$!nvBPsJMRiDDC@bKFRNY!nD2r#KjmSAHv^%iB@FDKmc$ztes3kaZd4$D^su8gWToSyX2wfWEt4rP5hbzSsSuGfqZuJZzyY!CoBr2h9*LdX&JAzWVP%EsEFSiC'
