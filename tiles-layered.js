
class TLViewer extends Application 
{
	static instance;
	super(options)
	{
	//console.log("Super called");
	}

	activateListeners(html) 
	{
	super.activateListeners(html);

	const myButtonV = html.find("button[name='Visible']");
	myButtonV.on("click", event => this._onClickButtonVisibility(event));

	const myButtonL = html.find("button[name='Locked']");
	myButtonL.on("click", event => this._onClickButtonLocked(event));

	const myButtonU = html.find("button[name='Up']");
	myButtonU.on("click", event => this._onClickButtonSort(true,event));

	const myButtonD = html.find("button[name='Down']");
	myButtonD.on("click", event => this._onClickButtonSort(false,event));

	}   

	async _onClickButtonVisibility(event) 
	{
		//console.log("Event target id "+event.target.id);

		const tileId = event.target.id;
		const tile = canvas.tiles.get(tileId);
		const isHidden = !tile.data.hidden;
		//putting tile into an array for updateMany function.
		const nData = [tile.data];

		await canvas.tiles.updateMany(nData.map(o=> 
		{
			return {_id:tileId,hidden:isHidden}
			
		}));
		this.render(false);
		}

		async _onClickButtonLocked(event) 
		{
		//console.log("Event target id "+event.target.id);

		const tileId = event.target.id;
		const tile = canvas.tiles.get(tileId);
		const isLocked = !tile.data.locked;
		//putting tile into an array for updateMany function.
		const nData = [tile.data];

		await canvas.tiles.updateMany(nData.map(o=> 
		{
			return {_id:tileId,locked:isLocked}		
		}));

		this.render(false);
	}

	async _onClickButtonSort(up, event) 
	{
		const tileId = event.target.id;
		const siblings = canvas.tiles.placeables;		
		// Determine target sort index		
		let i = 100;
		const update = siblings.map((o) => 
		{
			return {_id:o.id,z:i++};
		});

		//putting tile into an array for updateMany function.
		const nData = canvas.tiles.get(tileId);
		const nIndex = canvas.tiles.placeables.findIndex((o) => o.data.z == nData.data.z);
		let canUpdate = true;
				
		//swap z for the closest two in the order of the button then send it in update to actually change the order
		if (up)
		{  
			canUpdate = nIndex != siblings.length-1;
			if(canUpdate)
			{
				let z = update[nIndex].z;
				update[nIndex].z = update[nIndex+1].z;
				update[nIndex+1].z = z;
			}   			
		}
		else
		{
			canUpdate = nIndex != 0;
			if(canUpdate)
			{
				let z = update[nIndex].z;
				update[nIndex].z = update[nIndex-1].z;
				update[nIndex-1].z = z;
			}   
		}




		if(canUpdate)
		{
			
			//sends the update
			await canvas.tiles.updateMany(update);

		}
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

	var tiles = TilesLayer.instance.placeables.slice().reverse();	
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
		<td style="background: black; color: white;">Locked</td>
		<td style="background: black; color: white;">Up</td>
		<td style="background: black; color: white;">Down</td>`];
	}
	//Create a row for each combatant with the correct flag
	for(var i=0;i<tiles.length;i++)
	{
		let tileImage = tiles[i];
		let tileID = tileImage.id;
		let splitRes = tileImage.data.img.split('/');
		let tName = splitRes[splitRes.length-1].split('.')[0].replace(/%20/g,'');
		tileImage.name = tName;
		let isVisible  = tileImage.data.hidden;
		let isLocked = tileImage.data.locked;
		rows.push
		(
			`<tr><td width="70"><img src="${tileImage.data.img}" width="50" height="50"></img>
			</td><td>${tName}</td>
			<td><button type="button" id="${tileID}" name="Visible" onclick=''>${(!isVisible).toString()}</button></td>
			<td><button type="button" id="${tileID}" name="Locked" onclick=''>${isLocked.toString()}</button></td>
			<td><button type="button" id="${tileID}" name="Up" onclick=''>Up</button></td>
			<td><button type="button" id="${tileID}" name="Down" onclick=''>Down</button></td></tr>`
		);	
	}
	let myContents=`${table}`;
	rows.forEach(element => myContents+=element)
	myContents+="</table>"

	return myContents;

	}

}

Hooks.on('getSceneControlButtons', function(hudButtons)
{
    TLViewer.prepareButtons(hudButtons);
})