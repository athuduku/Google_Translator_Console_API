// API_KEY: 8d18dd899fmshdc7286f7c7eea3ap14783ejsnf787775f2cd1
var API_KEY = ''; // Enter the API_KEY before running the program

function getLangauge(){
    const fs = require('fs');
    fileName = 'LanguageOptions.txt';

    let data = fs.readFileSync(fileName).toString();
    let langs = data.split('\n');
    
    languageMap = {};

    langs.map((lang)=>{
        let langSet;
        if(lang.includes(" ")){
            langSet = lang.split(' ');
            languageMap[langSet[1]] = langSet[0];
        }
        else{
            langSet = lang.split('\t');
            languageMap[langSet[1]] = langSet[0];
        }
    })
    return languageMap;
}

function getLanguageAbb(language){
    let languages = getLangauge();
    
    let found = false;

    for(let k in languages){
        if(languages[k] == language){
            found = true;
            return k;
        }
    }
    if(!found){
        console.log("Language given is not available");
        process.exit(1);
    }
}

async function getTransalation(text,abb){
    let prevSource = await getSource(text);
    if(prevSource == abb){
        console.log("Detected language matches requested translation language.");
        process.exit(1);
    }

    let axios = require('axios')

    const encodedParams = new URLSearchParams();
    encodedParams.append("q", text);
    encodedParams.append("target", abb);
    encodedParams.append("source", prevSource);

    const options = {
        method: 'POST',
        url: 'https://google-translate1.p.rapidapi.com/language/translate/v2',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'Accept-Encoding': 'application/gzip',
          'X-RapidAPI-Key': API_KEY,
          'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
        },
        data: encodedParams
    };

    await axios.request(options).then((response) => {
        let data = response.data.data['translations'][0]['translatedText'];
        console.log("\nTranslated passage:");
        console.log(data);
        console.log(`Detected source language: ${getLangauge()[prevSource]}`);
        console.log("\nStats:");
        getLongestAvgWords(text,data,prevSource,abb);
        getCommonWords(text,data);
    }).catch(function (error) {
        console.log(error);
    });
}

async function getSource(text){
    const axios = require("axios");

    const encodedParams = new URLSearchParams();
    encodedParams.append("q", text);

    const options = {
        method: 'POST',
        url: 'https://google-translate1.p.rapidapi.com/language/translate/v2/detect',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'Accept-Encoding': 'application/gzip',
          'X-RapidAPI-Key': API_KEY,
          'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
        },
        data: encodedParams
    };

    const data = axios.request(options).then((response)=>{
        return response.data.data.detections[0][0].language
    }).catch(function (error) {
        console.error(error);
    });
    return data;

}

async function getLongestAvgWords(text1,text2,prevSource,nextSource){
    let avgLength1 = 0;
    let avgLength2 = 0;

    let splitText1 = text1.split(" ");
    let splitText2 = text2.split(" ");

    splitText1.map((word)=>{
        avgLength1 += word.length;
    });
    avgLength1 = avgLength1/splitText1.length;

    splitText2.map((word)=>{
        avgLength2 += word.length;
    });
    avgLength2 = avgLength2/splitText2.length;

    if(avgLength1 > avgLength2){
        console.log(`Longest average word is: ${getLangauge()[prevSource]}`);
    }
    else if(avgLength2 > avgLength1){
        console.log(`Longest average word is: ${getLangauge()[nextSource]}`);
    }
    else{
        console.log(`Longest average word is: ${getLangauge()[prevSource]}`);
    }
}

async function getCommonWords(text1,text2){
    const words1 = [...new Set(text1.split(' '))];
    const words2 = [...new Set(text2.split(' '))];

    let commonCount = 0;

    for(let i=0;i<words1.length;i++){
        for(let j=0;j<words2.length;j++){
            if(words1[i] == words2[j]){
                commonCount = commonCount + 1;
            }
        }
    }

    if(commonCount <= 0){
        console.log("Translations have no words in common.");
    }
    else{
        console.log("There is at least one word found in both passages.");
    }
}

function main(){
    try{
        const readline = require("readline");
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question("Input a passage: ", function(passage) {
            rl.question("Which language would you like to translate to? ", function(language) {
                abb = getLanguageAbb(language);
                getTransalation(passage,abb);
                rl.close();
            })
        })
        
    }
    catch(e){
        console.log(e);
    }
}

// calling the translator
main();
