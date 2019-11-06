#! /usr/bin/env node

var fs = require('fs');

const args = process.argv.slice(2);
const inFile = args[0];
const outFile = args[1];

fs.readFile(inFile, function(err, buf) {
    let nbOfColumns = buf
        .toString()
        .split("\n")[0]
        .match(/,/g)
        .length;
    let newString = buf
        .toString()
        .replace(/[^\x00-\x7F]/g, "a")
        .replace(/\\/g, '&#92;')
        .replace(/\\([\s\S])|(")/g,"\\$1$2")
        .split("\n")
        .map(line => {
            line = line.replace(/(\r\n|\n|\r)/gm, "");
            let commaCount = (line.match(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/g) || []).length;
            if (commaCount < nbOfColumns)
                for(let i = 0; i< (nbOfColumns - commaCount); i++)
                    line += ","

            line = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map( e => {
                if(isNaN(e) || e === "" || e === "Infinity")
                    return '"' + e + '"'
                else{
                    return JSON.parse(e)
                }
                    
            }).join()
            line = "[" + line + "]\n";
            return line
        });

    fs.writeFile(outFile, newString.join(''), function(err) {
        if (err) throw err;
    });
});
