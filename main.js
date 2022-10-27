const Sim = require('pokemon-showdown');
const {Teams} = require('pokemon-showdown');
var fs = require('fs');
const { Console } = require('console');


stream = new Sim.BattleStream();
var team1 = {1: {name: 'Palkia', moves: ['Hydro Pump', 'Spacial Rend', 'Earth Power', 'Trick Room']}
            ,2: {name: 'Amoonguss', moves: ['Pollen Puff', 'Rage Powder', 'Spore', 'Protect']}
            ,3: {name: 'Calyrex-Ice', moves:['Glacial Lance', 'High Horsepower', 'Swords Dance', 'Trick Room']}
            ,4: {name: 'Incineroar', moves:['Flare Blitz', 'Darkest Lariat', 'Fake Out', 'Throat Chop']}
            ,5: {name: 'Porygon2', moves:['Foul Play', 'Recover', 'Eerie Impulse', 'Trick Room']}
            ,6: {name: 'Tapu Fini', moves:['Moonblast', "Nature's Madness", 'Heal Pulse', 'Protect']}};
var team2 = {1: {name: 'Zacian', moves: ['Behemoth Blade', 'Play Rough', 'Sacred Sword', 'Protect']}
            ,2: {name: 'Kyogre', moves: ['Water Spout', 'Origin Pulse', 'Ice Beam', 'Protect']}
            ,3: {name: 'Kartana', moves: ['Leaf Blade', 'Smart Strike', 'Sacred Sword', 'Aerial Ace']}
            ,4: {name: 'Shedinja', moves: ['Poltergeist', 'Shadow Sneak', 'Endure', 'Will-O-Wisp']}
            ,5: {name: 'Incineroar', moves: ['Flare Blitz', 'Darkest Lariat', 'Throat Chop', 'Fake Out']}
            ,6: {name: 'Thundurus', moves: ['Thunderbolt', 'Taunt', 'Eerie Impulse', 'Thunder Wave']}};
var noTargetMoves = ['Trick Room', 'Rage Powder', 'Protect', 'Swords Dance', 'Recover', 'Origin Pulse', 'Endure', 'Ally Switch', 'Water Spout', 'Glacial Lance'];
var active = {'p1a': {}, 'p1b': {}, 'p2a': {}, 'p2b': {}};
var og_cmd1;
var og_cmd2;
var oneLeft1 = false;
var oneLeft2 = false;
(async () => {
    for await (const output of stream) {
        console.log(output);
        
        if (output.includes('update')){
            var lines = output.split('\n');
            
            for(var i = 0; i < lines.length; i++){
                if(lines[i].includes('p1a: ') || lines[i].includes('p1b: ') || lines[i].includes('p2a: ') || lines[i].includes('p2b: ')){
                    player = lines[i].match(/p+\d+[a,b]/)[0];
                    var cut = lines[i].substring(lines[i].indexOf(player)+4);
                    active[player] = cut.match(/(Calyrex-Ice|Tapu Fini|Porygon2|\w+)/)[0]
                    if(active[player] == 'Calyrex'){
                        active[player] = 'Calyrex-Ice';
                    }
                }
                if(lines[i].includes('Incineroar|Parting Shot') && output.includes("|t")){
                    currentTeam1 = [];
                    currentTeam2 = [];
                    var str = lines[i].substring(0, lines[i].indexOf('Parting Shot'));
                    var player = str.match(/p+\d+[a,b]/)[0];
                    if(!lines[i+1].includes('-activate') && !lines[i+1].includes('move: Protect')){
                    if(player.includes('1')){
                        for(var x in team1){
                            if((team1[x]['name'] != active['p1a']) && (team1[x]['name'] != active['p1b'])&& (team1[x]['name'] != 'DEAD')){
                                currentTeam1.push(team1[x]['name']);
                            }
                        }
                        if(currentTeam1.length != 0){
                            var random = Math.floor(Math.random() * currentTeam1.length);
                            active[player] = currentTeam1[random];
                            console.log(`>p1 switch ` + currentTeam1[random])
                            stream.write(`>p1 switch ` + currentTeam1[random]);
                        }
                    }
                    else if(player.includes('2')){
                        for(var x in team2){
                            if((team2[x]['name'] != active['p2a']) && (team2[x]['name'] != active['p2b'])&&(team2[x]['name'] != 'DEAD')){
                                currentTeam2.push(team2[x]['name']);
                            }
                        }
                        if(currentTeam2.length != 0){
                            var random = Math.floor(Math.random() * currentTeam2.length);
                            active[player] = currentTeam1[random]
                            console.log(`>p2 switch ` + currentTeam2[random]);
                            stream.write(`>p2 switch ` + currentTeam2[random]);
                        }
                    }
                }
                }
                else if(lines[i].includes('You need a switch response')){
                    var currentTeam1 = [];
                    var currentTeam2 = [];
                    player = lines[i-1]
                    if(player.includes('1')){
                        for(var x in team1){
                            if((team1[x]['name'] != active['p1a']) && (team1[x]['name'] != active['p1b'])&& (team1[x]['name'] != 'DEAD') && (team1[x]['name'] != undefined)){
                                currentTeam1.push(team1[x]['name']);
                            }
                        }
                        console.log(`>p1 switch ` + currentTeam1[Math.floor(Math.random() * currentTeam1.length)])
                        stream.write(`>p1 switch ` + currentTeam1[Math.floor(Math.random() * currentTeam1.length)]);
                    }
                    else if(player.includes('2')){
                        for(var x in team2){
                            if((team2[x]['name'] != active['p2a']) && (team2[x]['name'] != active['p2b'])&&(team2[x]['name'] != 'DEAD')&& (team2[x]['name'] != undefined)){
                                currentTeam2.push(team2[x]['name']);
                            }
                        }
                        console.log(`>p2 switch ` + currentTeam2[Math.floor(Math.random() * currentTeam2.length)]);
                        stream.write(`>p2 switch ` + currentTeam2[Math.floor(Math.random() * currentTeam2.length)]);
                    }
                }
                else if(lines[i].includes("You can't switch to")){
                    player = lines[i-1].match(/p+\d/)[0].substring(1);
                    var currentTeam1 = [];
                    var currentTeam2 = [];
                    if(player.includes('1')){
                        for(var x in team1){
                            if((team1[x]['name'] != active['p1a']) && (team1[x]['name'] != active['p1b'])  && (team1[x]['name'] != 'DEAD')&& (team1[x]['name'] != undefined)){
                                currentTeam1.push(team1[x]['name']);
                            }
                        }
                        rand = Math.floor(Math.random() * currentTeam1.length);
                        console.log(`>p1 switch ` + currentTeam1[rand])
                        stream.write(`>p1 switch ` + currentTeam1[rand]);
                    }
                    else{
                        for(var x in team2){
                            if((team2[x]['name'] != active['p2a']) && (team2[x]['name'] != active['p2b'])  && (team2[x]['name'] != 'DEAD')&& (team2[x]['name'] != undefined)){
                                currentTeam2.push(team2[x]['name']);
                            }
                        }
                        rand = Math.floor(Math.random() * currentTeam2.length)
                        console.log(`>p2 switch ` + currentTeam2[rand])
                        stream.write(`>p2 switch ` + currentTeam2[rand]);
                    }
                
                }
                else if(lines[i].includes('|request|')){
                    player = lines[i-1].match(/p+\d/)[0].substring(1);
                    activeStr = lines[i].substring(20, lines[i].indexOf('}]}]'));
                    activeMoves = activeStr.split('{"moves":[{')
                    for(var x = 0; x < activeMoves.length; x++){
                        activeMoves[x] = activeMoves[x].split('},{');
                    }
                    for(var x = 0; x < activeMoves.length; x++){
                        for(var y = 0; y < activeMoves[x].length; y++){
                            if(activeMoves[x][y].includes('disabled":true')){
                                if(player.includes('1')){
                                    if(x==1){
                                        for(n in team1){
                                            if(team1[n]['name'] == active['p1a']){
                                                team1[n]['moves'][y] = 'DISABLED'
                                            }
                                        }
                                    }
                                    else{
                                        for(n in team1){
                                            if(team1[n]['name'] == active['p1b']){
                                                team1[n]['moves'][y] = 'DISABLED'
                                            }
                                        }
                                    }
                                }
                                else if(player.includes('2')){
                                    if(x==1){
                                        for(n in team2){
                                            if(team2[n]['name'] == active['p2a']){
                                                team2[n]['moves'][y] = 'DISABLED'
                                            }
                                        }
                                    }
                                    else{
                                        for(n in team2){
                                            if(team2[n]['name'] == active['p2b']){
                                                team2[n]['moves'][y] = 'DISABLED'
                                            }
                                        }
                                    }
                                }
                            }
                            else if(activeMoves[x][y].includes('disabled":false')){
                                if(player.includes('1')){
                                    if(x==1){
                                        for(n in team1){
                                            if((team1[n]['name'] == active['p1a']) && (team1[n]['moves'][y] == 'DISABLED')){
                                                team1[n]['moves'][y] = activeMoves[x][y].match(/(?<="move":").+(?=","id)/)[0]
                                            }
                                        }
                                    }
                                    else{
                                        for(n in team1){
                                            if((team1[n]['name'] == active['p1b']) && (team1[n]['moves'][y] == 'DISABLED')){
                                                team1[n]['moves'][y] = activeMoves[x][y].match(/(?<="move":").+(?=","id)/)[0]
                                            }
                                        }
                                    }
                                }
                                else if(player.includes('2')){
                                    if(x==1){
                                        for(n in team2){
                                            if((team2[n]['name'] == active['p2a']) && (team2[n]['moves'][y] == 'DISABLED')){
                                                team2[n]['moves'][y] = activeMoves[x][y].match(/(?<="move":").+(?=","id)/)[0]
                                            }
                                        }
                                    }
                                    else{
                                        for(n in team2){
                                            if((team2[n]['name'] == active['p2b']) && (team2[n]['moves'][y] == 'DISABLED')){
                                                team2[n]['moves'][y] = activeMoves[x][y].match(/(?<="move":").+(?=","id)/)[0]
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                }
            }
        }
        if(output.includes('|faint|') && (!output.includes('|win|'))){
            var cmd1 = ['>p1', '', '', ',', '', ''];
            var c1 = 0;
            var currentTeam1 = [];
            var firstRandom1;

            
            var cmd2 = ['>p2', '', '', ',', '', ''];
            var c2 = 0;
            var currentTeam2 = [];
            var firstRandom2;

            for(var n = 0; n < lines.length; n++){
                if(lines[n].includes('|faint|')){
                    player = lines[n].match(/p+\d+[a,b]/)[0].substring(0);
                    fainted = lines[n].substring(lines[n].indexOf(player) + 5);
                    if(fainted == 'Calyrex'){
                        fainted = 'Calyrex-Ice';
                    }         
                if(player.includes('1')){
                    if(c1 == 0){
                        for(var x in team1){
                            if(team1[x]['name'].includes(fainted)){
                                delete team1[x]
                            }
                        }
                    for(var x in team1){
                        if((team1[x]['name'] != active['p1a']) && (team1[x]['name'] != active['p1b']) && (team1[x]['name'] != 'DEAD') && (team1[x]['name'] != undefined)){
                            currentTeam1.push(team1[x]['name']);
                        }
                    }
                    if((currentTeam1.length == 0)){
                        cmd1 = [];
                        oneLeft1 = true;
                        if((player == 'p1a')){
                            active['p1a'] = {};
                        }
                        else if(player == 'p1b'){
                            active['p1b'] = {};
                        }
                        
                    }
                    else{
                        firstRandom1 = Math.floor(Math.random() * currentTeam1.length)
                        cmd1[1] = 'switch';
                        cmd1[2] = currentTeam1[firstRandom1];
                        c1++;
                        if(currentTeam1.length != 0){
                            active[player] = currentTeam1[firstRandom1];
                        }
                        currentTeam1.splice(firstRandom1,1);
                }
                }
                else{
                    for(var x in team1){
                        if(team1[x]['name'] == fainted){
                            delete team1[x]
                        }
                    }
                    
                    if(currentTeam1.length != 0){
                        var rand = Math.floor(Math.random() * currentTeam1.length)
                        cmd1[4] = 'switch';
                        cmd1[5] = currentTeam1[rand]
                        c1++;
                        active[player] = currentTeam1[rand];
                    }
                    else{
                        cmd1[3] = '';
                    }
                    
                }
                
            }
            else if(player.includes('2')){
                
                if(c2 == 0){
                    for(var x in team2){
                        if(team2[x]['name'].includes(fainted)){
                            delete team2[x]
                        }
                    }
        
                    for(var x in team2){
            if((team2[x]['name'] != active['p2a']) && (team2[x]['name'] != active['p2b']) && (team2[x]['name'] != 'DEAD') && (team2[x]['name'] != undefined)){
                currentTeam2.push(team2[x]['name']);
            }
        }
        if((currentTeam2.length == 0)){
            cmd2 = [];
            oneLeft2 = true;
            if((player == 'p2a')){
            active['p2a'] = {}
            }
            else if(player == 'p2b'){
                active['p2b'] = {};
            }
            
        }
        else{
            firstRandom2 = Math.floor(Math.random() * currentTeam2.length);
            cmd2[1] = 'switch';
            cmd2[2] = currentTeam2[firstRandom2];
            c2++;
            if(currentTeam2.length != 0){
                active[player] = currentTeam2[firstRandom2];
            }
            currentTeam2.splice(firstRandom2,1);
    }
    }
    else{
        
        for(var x in team2){
            if(team2[x]['name'] == fainted){
                delete team2[x]
            }
        }
        if(currentTeam2.length != 0){
        var rand = Math.floor(Math.random() * currentTeam2.length)
        cmd2[4] = 'switch';
        cmd2[5] = currentTeam2[rand]
        c2++;
        active[player] = currentTeam2[rand];
        }
        else{
            cmd2[3] = '';
        }
    }
}   
}
}


if(c1 == 1){
cmd1[3] = '';
}
if(c2 == 1){
cmd2[3] = '';
}
if(c1 != 0){

    console.log(cmd1.join(' '))
    stream.write(cmd1.join(' '));         
}
if(c2 != 0){

    console.log(cmd2.join(' '))
    stream.write(cmd2.join(' '));
}
}
    var lines = output.split('\n');
    if(lines[lines.length-1].includes('|turn|') || lines[lines.length-1].includes('unboost')){
                var cmd1 = [">p1","choice", "", "", ", ", "choice", "", ""];
                var cmd2 = [">p2","choice", "", "", ", ", "choice", "", ""];

                var p1_turn = 1;
                var p2_turn = 1;
                if(oneLeft1 == false){
                for(var x = 0; x < cmd1.length; x++){
                    if((cmd1[x] == 'choice')){
                        
                        var move = (Math.floor(Math.random() * 4));
                        var target = (Math.floor(Math.random() * 2)+1);
                        cmd1[x] = 'move';
                        if(p1_turn == 1){
                            for(n in team1){
                                if((team1[n]['name'] == active['p1a']) && (team1[n]['moves'][move] == 'DISABLED')){
                                    while(team1[n]['moves'][move] == 'DISABLED'){
                                        move = (Math.floor(Math.random() * 4));
                                    }
                                }
                            }
                            cmd1[x+1] = move+1;
                            for(var i in team1){
                                if(team1[i]['name'] == active['p1a']){
                                    if(noTargetMoves.includes(team1[i]['moves'][move])){
                                        cmd1[x+2] = "";
                                    }
                                    else{
                                        cmd1[x+2] = target;
                                    }
                                }        
                            }
                            p1_turn+=1;
                        }
                        else{
                            for(n in team1){
                                if((team1[n]['name'] == active['p1b']) && (team1[n]['moves'][move] == 'DISABLED')){
                                    while(team1[n]['moves'][move] == 'DISABLED'){
                                        move = (Math.floor(Math.random() * 4));
                                    }
                                }
                            }
                            cmd1[x+1] = move+1;
                            for(var i in team1){
                                if(team1[i]['name'] == active['p1b']){
                                    if(noTargetMoves.includes(team1[i]['moves'][move])){
                                        cmd1[x+2] = "";
                                    }
                                    else{
                                        cmd1[x+2] = target;
                                    }
                                }
                            }
                        }
                    }
                }
            }
                    else{
                        var cmd1 = [`>p1`,'move','','']
                        var move = (Math.floor(Math.random() * 4));
                        var target = (Math.floor(Math.random() * 2)+1);
                        for(n in team1){
                            if(((team1[n]['name'] == active['p1a']) || (team1[n]['name'] == active['p1b'])) && (team1[n]['moves'][move] == 'DISABLED')){
                                while(team1[n]['moves'][move] == 'DISABLED'){
                                    move = (Math.floor(Math.random() * 4));
                                }
                            }
                        }
                        cmd1[2] = move+1;
                        for(var i in team1){
                            if((team1[i]['name'] == active['p1a']) || (team1[n]['name'] == active['p1b'])){
                                if(noTargetMoves.includes(team1[i]['moves'][move])){
                                    cmd1[3] = "";
                                }
                                else{
                                    cmd1[3] = target;
                                }
                            }        
                        }
                    }
                if(oneLeft2 == false){
                for(var x = 0; x < cmd2.length; x++){
                    if((cmd2[x] == 'choice')){
                        var move = (Math.floor(Math.random() * 4));
                        var target = (Math.floor(Math.random() * 2)+1);
                        cmd2[x] = 'move';
                        if(p2_turn == 1){
                            for(n in team2){
                                if((team2[n]['name'] == active['p2a']) && (team2[n]['moves'][move] == 'DISABLED')){
                                    while(team2[n]['moves'][move] == 'DISABLED'){
                                        move = (Math.floor(Math.random() * 4));
                                    }
                                }
                            }
                            cmd2[x+1] = move+1;
                            for(var i in team2){
                                if(team2[i]['name'] == active['p2a']){
                                    if(noTargetMoves.includes(team2[i]['moves'][move])){
                                        cmd2[x+2] = "";
                                    }
                                    else{
                                        cmd2[x+2] = target;
                                    }
                                }
                            }
                            p2_turn+=1;
                        }
                        
                        else{
                            for(n in team2){
                                if((team2[n]['name'] == active['p2b']) && (team2[n]['moves'][move] == 'DISABLED')){
                                    while(team2[n]['moves'][move] == 'DISABLED'){
                                        move = (Math.floor(Math.random() * 4));
                                    }
                                }
                            }
                            cmd2[x+1] = move+1;
                            for(var i in team2){
                                if(team2[i]['name'] == active['p2b']){
                                    if(noTargetMoves.includes(team2[i]['moves'][move])){
                                        cmd2[x+2] = "";
                                    }
                                    else{
                                        cmd2[x+2] = target;
                                    }
                                }
                            }
                        }
                    }
                    }
                }
                    else{
                        var cmd2 = [`>p2`,'move','','']
                        var move = (Math.floor(Math.random() * 4));
                        var target = (Math.floor(Math.random() * 2)+1);

                        for(n in team2){
                            if(((team2[n]['name'] == active['p2a']) || (team2[n]['name'] == active['p2b'])) && (team2[n]['moves'][move] == 'DISABLED')){
                                while(team2[n]['moves'][move] == 'DISABLED'){
                                    move = (Math.floor(Math.random() * 4));
                                }
                            }
                        }
                        cmd2[2] = move+1;
                        for(var i in team2){
                            if((team2[i]['name'] == active['p2a']) || (team2[n]['name'] == active['p2b'])){
                                if(noTargetMoves.includes(team2[i]['moves'][move])){
                                    cmd2[3] = "";
                                }
                                else{
                                    cmd2[3] = target;
                                }
                            }
                        }
                    }
                
                
                console.log('PLAYER ONE MOVE: ' + cmd1.join(' '));
                console.log('PLAYER TWO MOVE: ' + cmd2.join(' '));

                stream.write(cmd1.join(' '));
                stream.write(cmd2.join(' '));
            }
            console.log('ACTIVE POKEMON: ' + JSON.stringify(active));
            console.log('TEAM 1: ' + JSON.stringify(team1));
            console.log('TEAM 2: ' + JSON.stringify(team2));
        }
})();

stream.write(`>start {"formatid":"doublesou"}`);
stream.write(`>player p1 {"name":"Alice","team":"Palkia||LifeOrb|Pressure|HydroPump,SpacialRend,EarthPower,TrickRoom|Modest|252,,84,156,4,12||,0,,,,|S|50|]Amoonguss||FocusSash|Regenerator|PollenPuff,RagePowder,Spore,Protect|Relaxed|236,,156,,116,||,0,,,,0|S|50|]Calyrex-Ice||BabiriBerry|AsOneGlastrier|GlacialLance,HighHorsepower,SwordsDance,TrickRoom|Adamant|212,252,,,44,||||50|]Incineroar||ShucaBerry|Intimidate|FlareBlitz,DarkestLariat,FakeOut,ThroatChop|Careful|252,4,76,,156,20|||S|50|]Porygon2||Eviolite|Trace|FoulPlay,Recover,EerieImpulse,TrickRoom|Sassy|252,,20,,236,||,0,,,,0||50|]Tapu Fini||Leftovers|MistySurge|Moonblast,NaturesMadness,HealPulse,Protect|Calm|244,,180,4,76,4||,0,,,,|S|50|"}`);
stream.write(`>player p2 {"name":"Bob","team":"Zacian-Crowned||RustedSword|IntrepidSword|BehemothBlade,PlayRough,SacredSword,Protect|Adamant|236,76,4,,4,188|||S|50|]Kyogre||MysticWater|Drizzle|WaterSpout,OriginPulse,IceBeam,Protect|Timid|116,,28,108,4,252||,0,,,,||50|]Kartana||AssaultVest|BeastBoost|LeafBlade,SmartStrike,SacredSword,AerialAce|Jolly|4,4,4,,244,252|||S|50|]Shedinja||FocusSash|WonderGuard|Poltergeist,ShadowSneak,Endure,WillOWisp|Lonely|,252,,,,252||,,0,,0,||50|]Incineroar||ShucaBerry|Intimidate|FlareBlitz,DarkestLariat,ThroatChop,FakeOut|Impish|252,4,108,,132,12||,,,0,,|S|50|]Thundurus||SitrusBerry|Prankster|Thunderbolt,Taunt,EerieImpulse,ThunderWave|Calm|236,,140,4,76,52||,0,,,,||50|"}`);
stream.write('>p1 team 123456');
stream.write('>p2 team 123456');