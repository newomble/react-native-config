const fs = require('fs');
const pathLib = require('path');

const dotenv_pattern = /^(export\s|)+[\w]+=(.*?[^\\])$/
const customEnvFile = "./tmp/envfile";
const writeFileName = "GeneratedDotEnv.cs";
var defaultEnvFile = ".env";
var writePath = `../../../${writeFileName}`;
var file, raw;

var overWritePath = process.argv[2];
if (overWritePath) {
    console.log("Using custom write path" + overWritePath);
    writePath = overWritePath+writeFileName;
}

var enviroment = process.argv[3];
if (enviroment) {
    console.log("Using Enviroment: " + enviroment);
    defaultEnvFile = defaultEnvFile + enviroment;
} else {
    defaultEnvFile = defaultEnvFile + ".dev";
}

//pick a custom env file if set
if (fs.existsSync(customEnvFile)) {
  file = customEnvFile
} else {
  file = defaultEnvFile;
}

var path = pathLib.join(__dirname, `../../../${file}`);
if (fs.existsSync(path)) {
    raw = fs.readFileSync(path, "utf-8");
} else if (fs.existsSync(file)) {
    raw = fs.readFileSync(file, "utf-8");
} else {
    var defaultEnvPath = pathLib.join(__dirname, `../../../../${defaultEnvFile}`);
    if (fs.existsSync(defaultEnvPath)) {
        var defaultRaw = fs.readFileSync(defaultEnvPath, "utf-8");
        if (defaultRaw) {
            raw = defaultRaw + "\n" + raw;
        }
    }
}

//Get Keys and Values from env file
var propertyStrings = [];
if(raw && raw.length > 0){
    raw.split("\n").forEach((propertyLine) => {
        if(propertyLine && dotenv_pattern.test(propertyLine)){
            var objectArr = propertyLine.split("=");
            var value = objectArr[1].replace(/"/g,"");
            var propString = `\t\t\tenvDictionary.Add("${objectArr[0].replace(/export\s/,"")}", "${value.replace(/\r?\n|\r/, "")}\");\n`;
            propertyStrings.push(propString);
        }
    })
}

//Delete existing file
if (fs.existsSync(writePath)) {
    fs.unlinkSync(writePath);
}
//Create C# class with dictionary property 
fs.appendFileSync(writePath,
    "using System.Collections.Generic;\n\n" +
    "public class GeneratedDotEnv\n{\n"+
    "\tpublic Dictionary<string, object> EnvConstants\n\t{\n\t\tget\n\t\t{\n"+
    "\t\t\tDictionary<string, object> envDictionary = new Dictionary<string, object>();\n","utf-8"
);

if(!propertyStrings || propertyStrings.length < 1) {
    console.log("**************************");
    console.log("*** Missing .env file ****");
    console.log("**************************");
} else {
    propertyStrings.forEach((prop) => {
        fs.appendFileSync(writePath,prop,"utf-8");
    });
}

//complete file
fs.appendFileSync(writePath,
    "\t\t\treturn envDictionary;\n"+
    "\t\t}\n"+
    "\t}\n"+
    "}","utf-8"
);
console.log(`Wrote from ${path}`);
console.log(`Wrote to ${writePath}`);
