if (typeof MPPNotification == "undefined") $.getScript("https://ledlamp.github.io/electrashave-sound-selector/MPPNotification.js");
function SoundSelector(piano) {
    this.btn_pos = {};
    Object.defineProperties(this.btn_pos, {
        bottom: {
            configurable: true,
            get: function() {
                return $("#sound-btn").css("bottom") || "22px";
            },
            set: function(px) {
                $("#sound-btn").css("bottom", px);
            }
        },
        right: {
            configurable: true,
            get: function() {
                return $("#sound-btn").css("right") || "250px";
            },
            set: function(px) {
                $("#sound-btn").css("right", px);
            }
        }
    });
    this.initialized = false;
    this.loadingPacks = {};
    this.keys = piano.keys;
    this.notification;
    this.piano = piano;
    this.selected = localStorage.selected || "MPP Default";
    this.soundpacks = [];
    this.addPack({name: "MPP Default", keys: Object.keys(this.piano.keys), ext: ".wav.mp3", url: "/mp3/"}, false, true);
}

SoundSelector.prototype.addPack = function(url, autoLoad, isObj) {
    var self = this;
    self.loadingPacks[url] = true;
    if (!autoLoad) autoLoad = false;
    if (!isObj) isObj = false;
    function handleInfo(info, obj) {
        if (obj != true) info.url = url;
        if (self.soundpacks.indexOf(info)  != -1) return;
        info.html = document.createElement("li");
        info.html.className = "pack";
        info.html.innerText = info.name + " (" + info.keys.length + " keys)";
        info.html.onclick = function() {
            self.loadPack(info.name);
            self.notification.close();
            self.notification = undefined;
        };
        self.soundpacks.push(info);
        delete self.loadingPacks[url];
        self.soundpacks.sort(function(a, b) {
            if(a.name < b.name) return -1;
            if(a.name > b.name) return 1;
            return 0;
        });
        if (autoLoad) self.loadPack(info.name);
    }
    if (!isObj) {
        try {
        $.get(url + "/info.json").done(handleInfo);
        } catch(e) {
            delete self.loadingPacks[url];
        }
    } else handleInfo(url, true);
};
SoundSelector.prototype.addPacks = function(arr) {
    for (var i = 0; arr.length > i; i++) this.addPack(arr[i]);
};
SoundSelector.prototype.init = function() {
    var self = this;
    var loading = false;
    for (var i in self.loadingPacks) {
        if (self.loadingPacks[i] == true) {
            loading = true;
            break;
        }
    }
    if (loading) return setTimeout(function() {
        self.init();
    }, 250);
    if (self.initialized) return console.warn("Sound selector already initialized!");
    $("head").append(`<style>
    .notification .pack {
        padding: 0px;
        margin: 2px;
        background: #fdd;
        border: 1px solid #f84;
        border-radius: 4px;
        cursor: pointer;
    }
    .notification .pack.enabled { background: #dfd; cursor: not-allowed; }
    .notification .pack:after { content: ""; font-size: 10px; color: #a44; float: right; }
    .notification .pack.enabled:after { content: "Selected"; font-size: 10px; color: #4a4; float: right; }
    </style>`);
    $("body").append(`<div id="sound-btn" class="ugly-button sound-btn" style="position: fixed; bottom: ${self.btn_pos.bottom}; right: ${self.btn_pos.right}; width: 100px; z-index: 500;">Sound Select</div>`);
    $("#sound-btn").on("click", function() {
        if (document.getElementById("Notification-Sound-Selector") != null) return;
        var html = document.createElement("ul");
        $(html).append("<h1>Current Sound: " + self.selected + "</h1>");
        for (var i = 0; self.soundpacks.length > i; i++) {
            var pack = self.soundpacks[i];
            if (pack.name == self.selected) pack.html.classList = "pack enabled";
            else pack.html.classList = "pack";
            html.appendChild(pack.html);
        }
        self.notification = new MPPNotification({title: "Sound Selector:", html: html, id: "Sound-Selector", duration: -1, target: "#sound-btn"});//TODO:
    });
    self.loadPack(self.selected, true);
    self.initialized = true;
};
SoundSelector.prototype.loadPack = function(name, forced) {
    var pack;
    if (name) pack = this.soundpacks.filter(function(x) {
        return x.name == name;
    })[0];
    if (!pack) {
        console.warn("Sound pack does not exist! Loading default pack...");
        pack = this.soundpacks[0];
    }
    if (pack.name == this.selected && !forced) return console.warn("Sound pack already selected! To force it to load add true to the second argument.");
    this.piano.keys = {};
    for (var i = 0; pack.keys.length > i; i++) this.piano.keys[pack.keys[i]] = this.keys[pack.keys[i]]
    this.piano.renderer.resize();
    var self = this;
    for (var i in this.piano.keys) {
        if (!this.piano.keys.hasOwnProperty(i)) continue;
        (function() {
            var key = self.piano.keys[i];
            key.loaded = false;
            self.piano.audio.load(key.note, pack.url + key.note + pack.ext, function() {
                key.loaded = true;
                key.timeLoaded = Date.now();
            });
        })();
    }
    localStorage.selected = name;
    this.selected = name;
};
SoundSelector.prototype.removePack = function(name) {
    var found = false;
    for (var i = 0; this.soundpacks.length > i; i++) {
        var pack = this.soundpacks[i];
        if (pack.name == name) {
            this.soundpacks.splice(i, 1);
            if (pack.name == this.selected) this.loadPack("MPP Default");
            found = true;
            break;
        }
    }
    if (!found) console.warn("Sound pack not found!");
};