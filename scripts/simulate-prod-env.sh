#!/bin/bash
export DATABASE_URL="postgresql://postgres.kdolyswfxzkixknrivao:V%235UT7wE_tbRww%24@aws-1-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
export DIRECT_URL="postgresql://postgres.kdolyswfxzkixknrivao:V%235UT7wE_tbRww%24@aws-1-us-west-1.pooler.supabase.com:5432/postgres"
npm run build && npm start
