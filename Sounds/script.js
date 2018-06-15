var fs = require("fs");

var keys = ["a-1","as-1","b-1","c0","cs0","d0","ds0","e0","f0","fs0","g0","gs0","a0","as0","b0","c1","cs1","d1","ds1","e1","f1","fs1","g1","gs1","a1","as1","b1","c2","cs2","d2","ds2","e2","f2","fs2","g2","gs2","a2","as2","b2","c3","cs3","d3","ds3","e3","f3","fs3","g3","gs3","a3","as3","b3","c4","cs4","d4","ds4","e4","f4","fs4","g4","gs4","a4","as4","b4","c5","cs5","d5","ds5","e5","f5","fs5","g5","gs5","a5","as5","b5","c6","cs6","d6","ds6","e6","f6","fs6","g6","gs6","a6","as6","b6","c7"];

var main = fs.readdirSync("./");
main.forEach(function(x) {
    var item = fs.lstatSync(x);
    if (item.isDirectory()) {
        var sound = {name: x.replace(/_/g, " "), keys: []};
        fs.readdirSync(x).forEach(function(f) {
            try {
                var args = f.split(".");
            } catch(e) {
                console.error("Error parsing folder " + x + ", please verify all the files have a valid extension")
            }
            var key = args.shift();
            sound.keys[keys.indexOf(key)] = key;
            if (keys.indexOf(key) != -1) sound.ext = "." + args.join(".");
        });
        sound.keys = sound.keys.filter((d) => d != null);
        fs.writeFileSync("./" + x + "/info.json", JSON.stringify(sound, null, 4));
    }
});