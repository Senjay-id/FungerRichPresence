console.log("Initializing Discord RPC")

const DiscordRPC = require("discord-rpc");

const clientId = '1204014135357210644';
//DiscordRPC.register(clientId);
const startTimestamp = Date.now();

const rpc = new DiscordRPC.Client({ transport: 'ipc' });

rpc.login({ clientId }).catch(console.error);

let currentDetails;
let currentLocationText;
let currentLocationImage;
let currentEncounter;
let currentHP;
let currentMP;
let currentEXP;
let currentCharacterPortrait;
let currentCharacterClass;
let currentCharacterName;
let mainMenuScenes;
let characterList = {
  1: "Cahara",
  2: "D'arce",
  3: "Enki",
  4: "Ragnvaldr",
  5: "Marriage",
  6: "Abominable Marriage"
}

  MATTIE.infoAPI.isInMenu = function () {
    const onMenuMap = MATTIE.static.maps.onMenuMap();
    const currentScene = SceneManager._scene;
    let onMenuScene = false;

    if (!MATTIE_ModManager.modManager.checkMod('multiplayer'))
    {
      mainMenuScenes = [Scene_Title, MATTIE.scenes.modLoader, Scene_Load]
      mainMenuScenes.forEach((scene)=>
      {
        if(currentScene instanceof scene) onMenuScene = true      
      })
    }
    else if (MATTIE_ModManager.modManager.checkMod('multiplayer'))
    {
      mainMenuScenes = [
        Scene_Title, MATTIE.scenes.modLoader, MATTIE.scenes.multiplayer.host, MATTIE.scenes.multiplayer.join,
        MATTIE.scenes.multiplayer.main, MATTIE.scenes.multiplayer.lobby, MATTIE.scenes.multiplayer.startGame]
      mainMenuScenes.forEach((scene)=>{
      if(currentScene instanceof scene) onMenuScene = true
      })
    }

    return onMenuMap || onMenuScene;
};

var SENJAY = SENJAY || {};
SENJAY.richPresence = {};
SENJAY.richPresence.config = {};
SENJAY.richPresence.config._useCharacterClassName;

	const richPresenceName = 'richPresence';
	const params = PluginManager.parameters(richPresenceName);
	Object.defineProperties(SENJAY.richPresence.config, {
		_useCharacterClassName: {
			get: () => MATTIE.configGet('richPresence__useCharacterClassName', params.useCharacterClassName),
			set: (value) => { MATTIE.configSet('richPresence__useCharacterClassName', value); },
		},
	});

const useCharacterClassName = SENJAY.richPresence.config._useCharacterClassName;

function setActivity() {
    if (!rpc) {
      return;
    }

    if(!$gameTroop.inBattle())
    {
      currentDetails = `Exploring the Dungeon`
    }
    else
    {
      currentEncounter = MATTIE.infoAPI.currentlyFaughtEnemyName()
      currentDetails = `Fighting ${currentEncounter}`
    }

    currentHP = `${$gameParty.leader().hp}`
    currentMP = `${$gameParty.leader().mp}`
    currentEXP = `${$gameParty.leader().currentExp() - 57}`

    currentLocationText = `${$gameMap.displayName()}`
    currentLocationImage = currentLocationText.replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-/, '').replace(/-$/, '').replace(/'/g, '').replace(/å/g, 'a').toLowerCase();

    currentCharacterClass = `${$gameParty.leader()._characterName}`
    currentCharacterPortrait = currentCharacterClass

    if (!useCharacterClassName)
    {
      switch (currentCharacterClass)
      {
        case `mercenary`:
          currentCharacterName = characterList[1];
            break;
        case `mercenary_torch`:
          currentCharacterName = characterList[1];
            break;            
        case `knight`:
          currentCharacterName = characterList[2];
            break;
        case `knight_torch`:
          currentCharacterName = characterList[2];
            break;
        case `dark_priest`:
          currentCharacterName = characterList[3];
            break;
        case `dark_priest_torch`:
          currentCharacterName = characterList[3];
            break;
        case `outlander`:
          currentCharacterName = characterList[4];
            break;
        case `outlander_torch`:
          currentCharacterName = characterList[4];
            break;
        case `marriage_of_flesh1` : 
          currentCharacterName = characterList[5];
            break;
        case `marriage_of_flesh2` :
          currentCharacterName = characterList[6];
            break;
        default:
          currentCharacterName = currentCharacterClass;
      }    
    }
    else
    {
      currentCharacterName = currentCharacterClass;
    }

    rpc.setActivity({
      details: currentDetails,
      state: `Body: ${currentHP} | Mind: ${currentMP} | Hunger: ${currentEXP}`,
      startTimestamp,
      largeImageKey: currentLocationImage,
      largeImageText: currentLocationText,
      smallImageKey: currentCharacterPortrait,
      smallImageText: currentCharacterName,
      instance: false,
    });
  }

function setActivityInMainMenu() {
    if (!rpc) {
      return;
    }

    rpc.setActivity({
      details: 'In the Main Menu',
      startTimestamp,
      largeImageKey: 'title2',
      largeImageText: 'Fear & Hunger',
      instance: false,
    });
  }

  rpc.on('ready', () => {
    setActivityInMainMenu();
    console.log("Discord RPC is Ready")
  
    // activity can only be set every 15 seconds
    setInterval(() => {

      if (!MATTIE.infoAPI.isInMenu()){
              setActivity();
      }
      else
      {
        setActivityInMainMenu();
      }
    }, 15e3);
  });
  