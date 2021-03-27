let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
let path = require("path");
let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/match-results";
request(url, cb);

function cb(err, res, html) 
{
    if (err)
    {
        console.log(err);
    }
    else 
    {
        extractHtml(html);
    }
}



function extractHtml(html) 
{
    let selectorTool = cheerio.load(html);
    let matchCardArr = selectorTool(".col-md-8.col-16");

    for (let i = 0; i < matchCardArr.length; i++) {
        let scoreCardbtnsLinks = selectorTool(matchCardArr[i]).find(".btn.btn-sm.btn-outline-dark.match-cta");
        let scoreCardLinks = selectorTool(scoreCardbtnsLinks[2]).attr("href");
        let fulLink = "https://www.espncricinfo.com/" + scoreCardLinks
        getPlayerOfTHeMatch(fulLink);
    }

}


function getPlayerOfTHeMatch(fulLink)
{
    request(fulLink, callBack);

    function callBack(err, res, html) 
    {
        if (err) 
        {
            console.log(err);
        }
        else 
        {
            extractHtml1(html);
        }
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
        for (let j = 0; j < rows.length; j++) 
        {
            let allcols = selectorTool(rows[j]).find("td");
            if (allcols.length == 8) 
            {

                let player = selectorTool(allcols[0]).text();

                let runs = selectorTool(allcols[2]).text();

                let balls = selectorTool(allcols[3]).text();

                let fours = selectorTool(allcols[5]).text();

                let sixes = selectorTool(allcols[6]).text();

                let strikeRate = selectorTool(allcols[7]).text();

                makeFolderOfIpl();

                makeFolderOfTeam(teamNameArr[i]);

                let batsManObj = {
                    "Runs": runs,
                    "Balls": balls,
                    "Fours": fours,
                    "Sixes": sixes,
                    "Sr": strikeRate,
                    "Date": date,
                    "Venue": venue,
                    "Result": result,
                    "Opponent": teamNameArr[1 - i]
                }

                let batsManInfoArr = [];

                let pathofFile = path.join(path.join(path.join(__dirname, "IPL2020"), teamNameArr[i]), player.split(" ").join("").trim() + ".json");
                
                writeInFile(batsManObj, pathofFile);
            }
        }
    }
}


function makeFolderOfTeam(teamNameArr)
{
    let dir = path.join(path.join(__dirname,"IPL2020"),teamNameArr);

    if (!fs.existsSync(dir))
    {
        fs.mkdirSync(dir);
    }
}
function makeFolderOfIpl()
{
    let dir = path.join(__dirname,"IPL2020");

    if (!fs.existsSync(dir)) 
    {
        fs.mkdirSync(dir);
    }
}

function writeInFile(batsManObj,pathofFile)
{
    
    if (fs.existsSync(pathofFile)) 
    {
        let olddata = fs.readFileSync(pathofFile);
        olddata = JSON.parse(olddata);
        olddata.push(batsManObj);
        fs.writeFileSync(pathofFile,JSON.stringify(olddata));
    }
    else
    {
        let arr = [];
        arr.push(batsManObj);
        fs.writeFileSync(pathofFile,JSON.stringify(arr));
    }
}

console.log("Check folder IPL2020 for output");
