mongoimport \
    --host mongo \
    --db filters \
    --collection filters \
    --type json \
    --file /mongo_default_filters.json \
    --jsonArray