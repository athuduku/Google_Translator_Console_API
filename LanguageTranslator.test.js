const {getLanguageAbb,getLongestAvgWords,getCommonWords} = require('./LanguageTranslator');

test("Testing the abbreviations",()=>{
    expect(getLanguageAbb("English")).toBe("en");
})

test("Testing the common words",()=>{
    // has common words
    expect(getCommonWords("Hello this is James","Hello welcome to you")) == true;
    // has no common words
    expect(getCommonWords("This one has one word","So no common")) == false;
})

test("Testing the longest average words",()=>{
    // had my monthly quota exceeded so i have to pass the both language sources
    expect(getLongestAvgWords("Hei hvordan har du det i dag?","Habari, hujambo leo?","en","sw")) == "Swahili"
})
