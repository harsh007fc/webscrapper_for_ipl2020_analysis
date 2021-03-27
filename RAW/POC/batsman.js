// highest wickets taker
let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
let path = require("path");
const { createInflate } = require("zlib");
console.log("before");
let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/full-scorecard";
request(url,cb1);

function cb1(error,response,html){
    if(error)
    {
        console.log(error);
    }
    else
    {
        extractHtml1(html);
    }
}

function extractHtml1(html)
{
    let selectorTool = cheerio.load(html);
    let teamNameElemArr = selectorTool(".Collapsible h5");
    teamNameArr = [];
    for (let i = 0; i < teamNameElemArr.length; i++)
    {
        let teamName = selectorTool(teamNameElemArr[i]).text();
        teamName = teamName.split("INNINGS")[0]; 
        
        teamName = teamName.trim(); 
        teamNameArr.push(teamName)
     
    }

    let dateandvenue = selectorTool(".match-info.match-info-MATCH .description").text();
    let dateandvenueArr = dateandvenue.split(',');
    let venue = dateandvenueArr[1].trim();
    let date = dateandvenueArr[2].trim();


    let resultOfMatch = selectorTool(".match-info.match-info-MATCH .status-text span").text();
    let result = resultOfMatch.trim();  
  

    let batsmanTableArr = selectorTool(".table.batsman");
    

    for (let i = 0; i < batsmanTableArr.length; i++)
        {
            let rows = selectorTool(batsmanTableArr[i]).find("tbody tr");
            for( let j = 0; j < rows.length; j++)
            {
                let allcols = selectorTool(rows[j]).find("td");
                if(allcols.length == 8 )
                {
    
                    let player = selectorTool(allcols[0]).text().trim();
                    let runs = selectorTool(allcols[2]).text();
                    let balls = selectorTool(allcols[3]).text();
                    let fours = selectorTool(allcols[5]).text();
                    let sixes = selectorTool(allcols[6]).text();
                    let strikeRate = selectorTool(allcols[7]).text();
                    // console.log(player,runs,balls,fours,sixes,strikeRate,teamNameArr[i],teamNameArr[1-i]);

                    makeFolderOfIpl();
                    makeFolderOfTeam(teamNameArr[i]);
                    // createFile(teamNameArr[i],player.split(" ").join(""));

                    let batsManInfoArr = [];
                    let batsManObj = {
                        "Player":player,
                        "Runs": runs,
                        "Balls": balls,
                        "Fours":fours,
                        "Sixes":sixes,
                        "Sr":strikeRate,
                        "Date":date,
                        "Venue":venue,
                        "Result":result,
                        "Opponent":teamNameArr[1-i]
                    }
                    // batsManInfoArr.push({
                    //     "Runs": runs,
                    //     "Balls": balls,
                    //     "Fours":fours,
                    //     "Sixes":sixes,
                    //     "Sr":strikeRate,
                    //     "Date":date,
                    //     "Venue":venue,
                    //     "Result":result,
                    //     "Opponent":teamNameArr[1-i]
                    // });
                    // console.log(batsManInfoArr);

                    let pathofFile = path.join(path.join(path.join(__dirname,"IPL2020"),teamNameArr[i]),player.split(" ").join("").trim()+".json");
                    writeInFile(batsManObj,pathofFile);
                }
            }
            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    
        }
}


function makeFolderOfTeam(teamNameArr)
{
    let dir = path.join(path.join(__dirname,"IPL2020"),teamNameArr);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}
function makeFolderOfIpl()
{
    let dir = path.join(__dirname,"IPL2020");
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}

// function createFile(teamname,playername)
// {
//     //__dirname is inbuilt
//     let pathofFile = path.join(path.join(path.join(__dirname,"IPL2020"),teamname),playername.trim()+".json");
//     if (fs.existsSync(pathofFile) == false) 
//     {
//         let createStream = fs.createWriteStream(pathofFile);
//         createStream.end();
    
//     }
// }

function writeInFile(batsManObj,pathofFile)
{
    
    // fs.writeFileSync(pathofFile,JSON.stringify(Arr));


    if (fs.existsSync(pathofFile)) 
    {
        let olddata = fs.readFileSync(pathofFile)
        olddata = JSON.parse(olddata)
        olddata.push(batsManObj)
        fs.writeFileSync(batsManObj, JSON.stringify(olddata))
    }
    else
    {
        let arr = []
        arr.push(batsManObj)
        fs.writeFileSync(pathofFile, JSON.stringify(arr))
    }
}
console.log("after");