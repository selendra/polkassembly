import fetch from 'node-fetch'
import { sendmail } from './utils.js'

const networks = [process.env.SELENDRA_NETWORK, process.env.KUSAMA_NETWORK]

const ERROR_MAIL_TEXT  = "Kusama or selendra is down please check"
const ERROR_MAIL_SUBJECT = "Server down"

function networkCheck() {
    if (!networks) {
        text = "Kusama or selendra environment variable not found";
        subject = "Environment not set";
        sendmail(text, subject);
        process.exit(0);
    }
}

async function main(){
    networkCheck();
    for(let i = 0; i < networks.length; i++){
        const network = await fetch(networks[i]+'healthcheck');
        if (!network) {
            sendmail(ERROR_MAIL_TEXT, ERROR_MAIL_SUBJECT);
        }
        else {
            if (network.statusText !== 'OK'){
                sendmail(ERROR_MAIL_TEXT, ERROR_MAIL_SUBJECT);
            }
        }
        console.log("Network Status: ", network.statusText)
    }
}

main().catch(e => {console.error("Something went wrong with fetch please check servers"), sendmail(ERROR_MAIL_TEXT, ERROR_MAIL_SUBJECT)});
