
class TLViewer extends Application {
  super(options){
    //console.log("Super called");
  }

  activateListeners(html) {
    super.activateListeners(html);
	
    const myButtonV = html.find("button[name='Visible']");
    myButtonV.on("click", event => this._onClickButtonVisibility(event));
	
	const myButtonL = html.find("button[name='Locked']");
    myButton.on("click", event => this._onClickButtonLocked(event));
	
  }   
  
  async _onClickButtonVisibility(event) {
    //console.log("Event target id "+event.target.id);

    const tileId = event.target.id;
    const tile = canvas.tiles.get(tileId);
    const isHidden = !tile.data.hidden;
    const nData = [tile.data];
    
    await canvas.tiles.updateMany(nData.map(o=> 
	{
		return {_id:tileId,hidden:isHidden}
		
	}));
    this.render(false);
  }

  async _onClickButtonLocked(event) {
    //console.log("Event target id "+event.target.id);

    const tileId = event.target.id;
    const tile = canvas.tiles.get(tileId);
    const isLocked = !tile.data.locked;
    const nData = [tile.data];
    
    await canvas.tiles.updateMany(nData.map(o=> 
	{
		return {_id:tileId,locked:isLocked}		
	}));
	
    this.render(false);
  }

  async _onClickButtonSort(event, up) {
    //console.log("Event target id "+event.target.id);

    const tileId = event.target.id;
    const tile = canvas.tiles.get(tileId);
    const opHidden = !tile.data.hidden;
    const nData = [tile.data];
    
    await canvas.tiles.updateMany(nData.map(o=> 
	{
		return {_id:tileId,hidden:opHidden}
		
	}));
    this.render(false);
  }
  
  static prepareButtons(hudButtons)
  {
    let hud = hudButtons.find(val => {return val.name == "tiles";})
    if(game.user.isGM)
	{
		if (hud)
		{
			hud.tools.push(
			{
				name:"Tile Layer Viewer",
				title:"Pop-out Tile Layer Viewer",
				icon:"fas fa-bolt",
				onClick: ()=> 
				{
				  const delay = 200;

				  let opt=Dialog.defaultOptions;
				  opt.resizable=true;
				  opt.title="Tile Layering";
				  opt.width=400;
				  opt.height=500;
				  opt.minimizable=true;
				  
				  var viewer;
				  viewer = new TLViewer(opt);
				  viewer.render(true);              
				},
				button:true
			});
		}
	}
  }

  getData()
  {
    let content={content:`${this.prepareTLViewer()}`}
    return content;
  }

  prepareTLViewer()
  {
    console.log("Prepare tl viewer called");
    //Get a list of the active combatants


	var tiles = TilesLayer.instance.placeables;	
	var viewer = viewer;
	let table=`<h1>Tile Layers</h1><table border="1" cellspacing="0" cellpadding="4">`;

	//Create a header row
	let rows;
	if (game.user.isGM)
	{
		rows=[
		`<tr>
		<td style="background: black; color: white;"></td>
		<td style="background: black; color: white;">Tile</td>
		<td style="background: black; color: white;">Visbility</td>
		<td style="background: black; color: white;">Locked</td>`];
	}
	//Create a row for each combatant with the correct flag
	for(var i=0;i<tiles.length;i++)
	{
		let tileImage = tiles[i];
		let tileID = tileImage.id;
		let splitRes = tileImage.data.img.split('/');
		let tName = splitRes[splitRes.length-1].split('.')[0].replace(/\s/g,'');
		tileImage.name = name;
		let isVisible  = tileImage.data.hidden;
		let isLocked = tileImage.data.locked;
		rows.push
		(
			`<tr><td width="70"><img src="${tileImage.data.img}" width="50" height="50"></img>
			</td><td>${tName}</td>
			<td><button type="button" id="${tileID}" name="Visible" onclick=''>${!isVisible.toString()}</button></td>
			<td><button type="button" id="${tileID}" name="Locked" onclick=''>${isLocked.toString()}</button></td></tr>`
		);	
	}
	let myContents=`${table}`;
	rows.forEach(element => myContents+=element)
	myContents+="</table>"
	/*
	if (game.user.isGM)
	{
		myContents+=`<button type ="button" onclick='
		let actors = canvas.tokens.placeables;
		actors.forEach(actor =>{actor.setFlag("world","popcornHasActed",false)});
		game.combat.nextRound();
		ChatMessage.create({content: "Starting a new exchange.", speaker : { alias : "Game: "}})
		'>Next Exchange</button><p>`
		myContents+=`<button type ="button" onclick='
		let actors = canvas.tokens.placeables;
		actors.forEach(actor =>{actor.setFlag("world","popcornHasActed",false)});
		game.combat.endCombat();
		ChatMessage.create({content: "Ending the conflict.", speaker : { alias : "Game: "}})
		'>End this conflict</button>`
	}
	*/
	return myContents;

}

  // This function prepares the contents of the popcorn initiative viewer
  // Display the current exchange number
  // Display the actor icon of each combatant for which popcornHasActed is false or undefined.
  // Display the name of each combatant for which popcornHasActed is false or undefined.
  // Display a button that says 'act now'
  // At the end of the display of buttons etc. display a button that says 'next exchange'.

}

Hooks.on('getSceneControlButtons', function(hudButtons)
{
    TLViewer.prepareButtons(hudButtons);
})