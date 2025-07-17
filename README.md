# yourdns-website
Website for yourdns. Basically a GUI wrapper and account manager for [`yourdns-server`](https://github.com/Milk-Cool/yourdns-server).

Requires a google oauth token. If you don't wanna set it all up manually, see [yourdns-compose](https://github.com/Milk-Cool/yourdns-compose) for instructions on how to set it up with docker-compose.

## Setup
```bash
npm i
# for production:
npm run build
npm run start
# or, for development:
npm run dev
```
Don't forget to set up `tlds.txt` and `.env.local`!

## `tlds.txt`
This is a newline-separated list of allowed TLDs (without the leading dot).

## `.env.local`
```bash
AUTH_SECRET=SecureBase64String # openssl rand -base64 33
AUTH_GOOGLE_ID=GoogleOauthID
AUTH_GOOGLE_SECRET=GoogleOauthSecret
AUTH_TRUST_HOST=YourPublicDomain # e. g. yourdns.com

YOURDNS_API=http://localhost:5339 # API URL
YOURDNS_KEY=SecureKey # same as in yourdns-server/.env

DNS_IP=127.0.0.1 # e. g. 123.45.67.89
DNS_DOH_HOST=localhost # e. g. dns.yourdns.com, may be the same as AUTH_TRUST_HOST if you set it up correctly
```