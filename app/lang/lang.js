const settings = require('electron-settings');
import lang_en from './en';
import lang_pt from './pt';
import lang_nl from './nl';
import lang_de from './de';
import lang_fr from './fr';

export function traduction() {
		
	if(settings.has('settings.lang')){
		var l = settings.get('settings.lang');
		if(l == "en"){
			return lang_en;
		}else if(l == "pt"){
			return lang_pt;
		}
		else if(l == "nl"){
			return lang_nl;
		}
		else if(l == "de"){
			return lang_de;
		}
		else if(l == "fr"){
			return lang_fr;
		}
	}else{
		settings.set("settings.lang","en");
		return lang_en;
	}
}
