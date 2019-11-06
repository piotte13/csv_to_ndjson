#! /usr/bin/env node

const csvToNdjson = require('csv-to-ndjson');
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
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .split("\n")
        .map(line => {
            let commaCount = (line.match(/,/g) || []).length;
            if (commaCount < nbOfColumns)
                for(let i = 0; i< (nbOfColumns - commaCount); i++)
                    line += ","

            line = line.split(",").map( e => {
                if(isNaN(e))
                    return '"' + e + '"'
                else
                    return e
            }).join()
            line = "[" + line + "]\n";
            return line
        });

    fs.writeFile(outFile, newString.join(''), function(err) {
        if (err) throw err;
    });
});
