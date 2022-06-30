# Timer for SNU&Ventures
## Available Scripts
### `npm start`
Run dev. web front

### `npm test`
Run dev. server

### `npm run build`
Build frontend web

### `npm run setenv`
Make .env file

### `npm run server`
Run server

## How to Test
1. npm install
1. npm test
1. npm start (proxy to dev. server)

## How to release
1. npm install
1. npm build
1. npm run setenv
1. Edit .env (set environment variables)
1. npm run server

## How to set cron
1. Connect ec2 ssh
1. Edit run.sh  
cd /home/ubuntu/test-web  
node /home/ubuntu/test-web/server >> /home/ubuntu/output.out  

1. Change mode (chmod 744 run.sh & chmod 644 output.out)
1. sudo crontab -e
0 * * * * /home/ubuntu/test-web/run.sh (hour)