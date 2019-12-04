// const ecc = require('eosjs-ecc')
const { PrivateKey } = require('../PrivateKey')
const { PublicKey } = require('../PublicKey')
const { Signature } = require('../Signature')
const { ec } = require('elliptic')
const e = new ec('secp256k1')
const sigData = 'anything1'
// const sigDigestOrig = Buffer.from(ecc.sha256(sigData), 'hex')
const sigDigest = Buffer.from(e.hash().update(sigData).digest())
console.info('sigDigest:' + sigDigest)
// console.info('sigDigestOrig:', sigDigestOrig)
// console.info('sigDigest    :', sigDigest)
const privateKeys = [
    '5Juww5SS6aLWxopXBAWzwqrwadiZKz7XpKAiktXTKcfBGi1DWg8',
    '5Juww5SS6aLWxopXBAWzwqrwadiZKz7XpKAiktXTKcfBGi1DWg7',
    '5JnHjSFwewr7xyqAUAaVs51G7HmzE86DWGa3VAA5VvQriGYnSUr',
    '5JnHjSFwe4r7xyqAUAaVs51G7HmzE86DWGa3dAA5VvQriGYnSU5',
    '5JnHjSFwe4r7xyqAUAaVs51G7HmzE86DWGa3VAAdVvQriGYnSUr',
    '5JnHjSFwe4r7xyqAUAaVs53G7HmzE86DWGa3VAA5VvQriGYnSUr',
    '5K4XZH5XR2By7Q5KTcZnPAmUMU5yjUNBdoKzzXyrLfmiEZJqoKE',
    '5K4XZH5XR2By7Q5KTcZnPAmUDU5yjUNBdoKzzXyrLfmiEZJqoKE',
    '5K4XZH5XR2By7r5KTcZnPAmUMU5yjUNBdoKzzXyrLfmiEZJqoKE',
    '5K4XZH5XR2By7Q5KTcZnPAmUMU5yjUNBdoKzuXyrLfmiEZJqoKE',
    '5K4XZH5XR2By7Q5KTcZnPAmUMU5yjUNBdoKzzxyrLfmiEZJqoKE',
    '5KkXYBUb7oXrq9cvEYT3HXsoHvaC2957VKVftVRuCy7Z7LyUcQB',
    '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3',
    'PVT_K1_2jH3nnhxhR3zPUcsKaWWZC9ZmZAnKm3GAnFD1xynGJE1Znuvjd',
    '5HxQKWDznancXZXm7Gr2guadK7BhK9Zs8ejDhfA9oEBM89ZaAru'
];
const legacyPublicKeys = [
    'EOS7tgwU6E7pAUQJgqEJt66Yi8cWvanTUW8ZfBjeXeJBQvhTU9ypi',
    'EOS8VaY5CiTexYqgQZyPTJkc3qvWuZUi12QrZL9ssjqW2es6aQk2F',
    'EOS7VGhqctkKprW1VUj19DZZiiZLX3YcJqUJCuEcahJmUCw3wJEMu',
];
const k1FormatPublicKeys = [
    'PUB_K1_7tgwU6E7pAUQJgqEJt66Yi8cWvanTUW8ZfBjeXeJBQvhYTBFvY',
    'PUB_K1_8VaY5CiTexYqgQZyPTJkc3qvWuZUi12QrZL9ssjqW2es7e7bRJ',
    'PUB_K1_7VGhqctkKprW1VUj19DZZiiZLX3YcJqUJCuEcahJmUCw9RT8v2'
];
describe('signing tests', () => {
  it('signs some stuff', () => {
    let isCanonical = (sigData) => {
      console.log('length: ' + sigData.length)
      return !(sigData[1] & 0x80) && !(sigData[1] === 0 && !(sigData[2] & 0x80))
      && !(sigData[33] & 0x80) && !(sigData[33] === 0 && !(sigData[34] & 0x80));
    }


    let sigs = [];
    let keys = privateKeys; // generatePrivateKeys(10)

    for(let i = 0; i < keys.length; i++) {
      const ellipticKPriv = PrivateKey.fromString(keys[i]).toElliptic()
      const challenge = ellipticKPriv.sign(sigDigest, 'utf8', {canonical: true})
      const signature = Signature.fromElliptic(challenge)
      //console.info('signature: ', signature.toString())
      //console.info('signature data: ', signature.signature.data);
      if (isCanonical(signature.signature.data)) {
        console.info('key ' + keys[i] + ' Signature isCanonical');
      } else {
        console.info('key ' + keys[i] + ' Signature is NOT canonical');
      }
      //console.info('data: ', signature.signature.data.length)
      sigs.push(signature.signature.data);
    }

    for(let i = 0; i < sigs[0].length; i++) {
      let test = sigs[0][i];
      if (test < 128) {
        let expected = true;
        for(let j = 0; j < sigs.length; j++) {
          if (sigs[j][i] >= 128) {
            expected = false;
          }
          // else if (sigs[j][i+1] < 128) {
          //   if (i === 0 || i === 33) {
          //     console.log('next item at position ' + (i + 1) + ' is: ' + sigs[j][i+1])
          //   }
          //
          //   expected = false;
          // }
        }
        if (expected) {
          console.log('found at position: ' + i);
        }
      }
    }

    // const sig = Signature.fromString("SIG_K1_K3CbJh3JGdumz6zkfEUhmr8VgF8nYJMzCkN1K2e52CEprWYJw2P4CaLP8qQjXhLuZfddZ6HKGJ7pzeTgZUFdTrHiFdokD2");
    //
    // console.info('isCanonical: ', isCanonical(sig.signature.data));
  })
})

// function isCanonical(sigData) {
//   var test1 = !(sigData[1] & 0x80);
//   var test2 = !(sigData[1] === 0 && !(sigData[2] & 0x80));
//   var test3 = !(sigData[33] & 0x80);
//   var test4 = !(sigData[33] === 0 && !(sigData[34] & 0x80));
//
//   // console.info('1: ' + test1 + ' 2: ' + test2 + ' 3: ' + test3 + ' 4: ' + test4);
//   // console.info('Sliced at 0: ' + sigData.slice(0, 33));
//   // console.info('Sliced at 33: ' + sigData.slice(33));
//
//   return test1 && test2 && test3 && test4;
// }

function generatePrivateKeys(numberOfKeys) {
  let keys = [];
  for(let i = 0; i < numberOfKeys; i++) {
    keys.push(generatePrivateKey());
  }
  return keys;
}

function generatePrivateKey() {
   var result           = 'EOS7';
   var characters       = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
   var charactersLength = characters.length;
   for ( var i = 1; i < 50; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   console.log('key: ' + result);
   return result;
}
