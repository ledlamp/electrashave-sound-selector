$.getScript("http://files.meowbin.com/SoundSelector.js").done(() => {
    window.selector = new SoundSelector(MPP.piano);
    selector.addPacks(["http://files.meowbin.com/Sounds/Emotional/", /*"http://files.meowbin.com/Sounds/HardPiano/", */"http://files.meowbin.com/Sounds/Harp/", "http://files.meowbin.com/Sounds/Music_Box/", /*"http://files.meowbin.com/Sounds/NewPiano/", "http://files.meowbin.com/Sounds/PianoSounds/", */"http://files.meowbin.com/Sounds/Rhodes_MK1/", /*"http://files.meowbin.com/Sounds/SoftPiano/", */"http://files.meowbin.com/Sounds/Vintage_Upright/", "http://files.meowbin.com/Sounds/Steinway_Grand/", "http://files.meowbin.com/Sounds/SweetTiddies/", "http://files.meowbin.com/Sounds/Untitled/"]);
    selector.init();
});