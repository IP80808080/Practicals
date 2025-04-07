const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');

// Check and install secrets.js-grempe if not installed
function checkAndInstallSecretsPackage() {
  try {
    require.resolve('secrets.js-grempe');
  } catch (e) {
    console.log('Installing secrets.js-grempe...');
    execSync('npm install secrets.js-grempe', { stdio: 'inherit' });
  }
}

// SSS Practicals
const SSS = {
  '1': {
    title: '1. Stack Overflow (Vulnerable)',
    command: `node -e "function vuln(input){let buf=Buffer.alloc(8);buf.write(input);console.log('Buffer content:', buf.toString());}vuln('AAAAAAAAAAAAAAAA');"`
  },
  '2': {
    title: '1. Stack Overflow (Safe)',
    command: `node -e "function safe(input){let buf=Buffer.alloc(8);buf.write(input.slice(0,8));console.log('Buffer content:', buf.toString());}safe('AAAAAAAAAAAAAAAA');"`
  },
  '3': {
    title: '2. Install vulnerability assessment tool & run script',
    command: `echo "sudo apt update && sudo apt install nikto -y && nikto -h http://127.0.0.1"`
  },
  '4': {
    title: '3. Linux Penetration Testing (commands only)',
    command: `echo "nmap -sS 127.0.0.1 && nikto -h http://127.0.0.1 && sqlmap -u 'http://127.0.0.1/vuln.php?id=1' --dbs"`
  },
  '5': {
    title: '4. Basic Linux Commands',
    command: `echo "ping -c 4 8.8.8.8\ntraceroute 8.8.8.8\nunzip myfile.zip\nchmod +x myscript.sh\nsudo apt install curl\npasswd\nps aux | less\nps aux | grep firefox\necho 'Hacked Successfully'"`
  },
  '6': {
    title: '5. Wireshark Explanation',
    command: `echo "Wireshark captures and analyzes network packets for troubleshooting and monitoring."`
  }
};

// DLT Practicals
const DLT = {
  '1': {
    title: '1. AWS Credentials Sample',
    command: `echo "userId: 048283574313\nusername1: admin-user-2\npassword1: Ask Kamlesh\nusername2: admin-user-3\npassword2: Ask Kamlesh"`
  },
  '2': {
    title: '2. SHA-256 Hash, Brute Force Match',
    command: `node -e "const c=require('crypto');const h='2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824';['hi','hello','world'].forEach(w=>{const hw=c.createHash('sha256').update(w).digest('hex');if(hw===h)console.log('Match Found:',w,'=>',hw);})"`
  },
  '3': {
    title: '3. Find Valid Nonce (Difficulty 3 leading zeros)',
    command: `node -e "const c=require('crypto');let n=0,h='';let s=Date.now();do{h=c.createHash('sha256').update('block'+n).digest('hex');n++;}while(!h.startsWith('000'));console.log('Nonce found:',n-1);console.log('Hash:',h);console.log('Time taken:',(Date.now()-s)/1000 + 's');"`
  },
  '4': {
    title: '4. Shamir\'s Secret Sharing',
    command: (() => {
      checkAndInstallSecretsPackage();
      return `node -e "const s=require('secrets.js-grempe');const sec=s.str2hex('blockchain');const sh=s.share(sec,5,3);console.log('Generated Shares:', sh.slice(0,3));const rec=s.combine([sh[0],sh[1],sh[2]]);console.log('Recovered Secret:',s.hex2str(rec));"`
    })()
  },
  '5': {
    title: '5. Digital Signature using RSA',
    command: `node -e "const {generateKeyPairSync,sign,verify}=require('crypto');const {privateKey,publicKey}=generateKeyPairSync('rsa',{modulusLength:2048});const m=Buffer.from('hello');const sig=sign('sha256',m,privateKey);const valid=verify('sha256',m,publicKey,sig);console.log('Original Message:','hello');console.log('Signature Validated:',valid ? '✅ Signature is valid!' : '❌ Signature is invalid!');"`
  },
  '6': {
    title: '6. Bitcoin LockTime Simulator',
    command: `node -e "console.log('Simulating LockTime... Please wait 6 seconds');const t=Date.now()+5000;setTimeout(()=>{console.log('⏳ LockTime expired. Transaction is now valid and unlocked.')},6000)"`
  }
};

// CLI
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(`Select Subject:
1. SSS
2. DLT`);
rl.question('Enter 1 or 2: ', (subject) => {
  const practicals = subject === '1' ? SSS : DLT;
  console.log(`\nAvailable Practicals in ${subject === '1' ? 'SSS' : 'DLT'}:`);

  Object.entries(practicals).forEach(([key, val]) => {
    console.log(`${key}. ${val.title}`);
  });

  rl.question('Enter practical number: ', (num) => {
    const selected = practicals[num];
    if (!selected) {
      console.log('Invalid practical number.');
      rl.close();
      return;
    }

    console.log(`\nRunning: ${selected.title}`);
    console.log(`Command: ${selected.command}\n`);
    try {
      const output = execSync(selected.command, { encoding: 'utf-8', stdio: 'pipe' });
      console.log('Output:');
      console.log(output);
    } catch (err) {
      console.error('Error executing command:', err.message);
    }
    rl.close();
  });
});
