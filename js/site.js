function loadData(url){
	$.ajax({ 
	    type: 'GET', 
	    url: url, 
	    dataType: 'json',
	    success:function(response){
	        let dataHXL= hxlProxyToJSON(response);
	        init(dataHXL);
	    }
	});
}

function hxlProxyToJSON(input){
    var output = [];
    var keys=[]
    input.forEach(function(e,i){
        if(i==0){
            e.forEach(function(e2,i2){
                var parts = e2.split('+');
                var key = parts[0]
                if(parts.length>1){
                    var atts = parts.splice(1,parts.length);
                    atts.sort();                    
                    atts.forEach(function(att){
                        key +='+'+att
                    });
                }
                keys.push(key);
            });
        } else {
            var row = {};
            e.forEach(function(e2,i2){
                row[keys[i2]] = e2;
            });
            output.push(row);
        }
    });
    return output;
}

function init(dataHXLProxy,data){
	data = prepData(dataHXLProxy,data);
	config = calcMax(data);
	config['#value+funding+hrp+pct'] = 1;
	createTable(config,data);
}

function prepData(dataHXLProxy,data){
	let output = dataHXLProxy;
	//output = addColumn(output,data,'national_data','#value+funding+hrp+pct');
	/*output.forEach(function(d){
		if(d['#value+funding+hrp+pct']==''){
			d['#value+funding+hrp+txt'] = 'No Data';
			d['#value+funding+hrp+pct'] = -1
		} else {
			d['#value+funding+hrp+txt'] = Math.round(d['#value+funding+hrp+pct']*100)+'%';
		}
	});
	//output = addColumn(output,data,'national_data','#affected+inneed');
	output.forEach(function(d){
		if(d['#affected+inneed']==undefined){
			d['#affected+inneed'] = '-';
		} else {
			d['#affected+inneed'] = numberWithCommas(d['#affected+inneed']);
		}
	});
	//output = addColumn(output,data,'national_data','#affected+tested+per1000');
	output.forEach(function(d){
		if(d['#affected+avg+per1000+tested']==''){
			d['#affected+avg+per1000+tested']= 'No Data'
		}
	});
	//output = addColumn(output,data,'national_data','#vaccination+num+ratio');
	output.forEach(function(d){
		if(d['#vaccination+num+ratio']==''){
			d['#vaccination+num+ratio']= 'No Data'
		} else {
			d['#vaccination+num+ratio']= Math.round(d['#vaccination+num+ratio']*100)+'%';
		}
	});
	//output = addColumn(output,data,'national_data','#value+food+num+ratio');
	output.forEach(function(d){
		if(d['#value+food+num+ratio']==undefined){
			d['#value+food+num+ratio']= 'No Data'
		} else {
			d['#value+food+num+ratio']= Math.round(d['#value+food+num+ratio']*100)+'%';
		}
	});

	/*output.forEach(function(d){
		if(d['#affected+avg+infected']==undefined){
			d['#affected+avg+infected'] = 'No Data'
		} else {
			d['#affected+avg+infected'] = numberWithCommas(Math.round(d['#affected+avg+infected']));
		}
	});
	
	output.forEach(function(d){
		if(d['#affected+avg+killed']==undefined){
			d['#affected+avg+killed'] = 'No Data'
		} else {
			d['#affected+avg+killed'] = numberWithCommas(Math.round(d['#affected+avg+killed']));
		}

	});

	output.forEach(function(d){
		
		
		d['#affected+avg+change+killed+txt'] = Math.round(d['#affected+avg+change+killed+pct']);
		if(d['#affected+avg+change+killed+pct']>0.5){
			d['#affected+avg+change+killed+txt'] = '+'+d['#affected+avg+change+killed+txt']+'%';
		} else {
			d['#affected+avg+change+killed+txt'] = d['#affected+avg+change+killed+txt']+'%';
		}
		if(d['#affected+avg+change+killed+pct']=='inf'){
			d['#affected+avg+change+killed+pct']==1000
			d['#affected+avg+change+killed+txt'] = 'INF';
		}		
	});*/

	output.forEach(function(d){
		//column 1
		d['#affected+infected+new+per100000+weekly'] = (Math.round(d['#affected+infected+new+per100000+weekly']*10)/10).toFixed(1);
		
		//column 1 brackets
		//create text version for show and use pct for arrow calcs
		d['#affected+infected+new+pct+txt+weekly'] = Math.round(d['#affected+infected+new+pct+weekly']*100);
		if(d['#affected+infected+new+pct+txt+weekly']>0.5){
			d['#affected+infected+new+pct+txt+weekly'] = '+'+d['#affected+infected+new+pct+txt+weekly']+'%';
		} else {
			d['#affected+infected+new+pct+txt+weekly'] = d['#affected+infected+new+pct+txt+weekly']+'%';
		}

		if(d['#affected+infected+new+pct+weekly']=='inf'){
			d['#affected+infected+new+pct+weekly']==1000
			d['#affected+infected+new+pct+txt+weekly'] = 'INF';
		}

		//column 2
		d['#affected+killed+new+per100000+weekly'] = (Math.round(d['#affected+killed+new+per100000+weekly']*10)/10).toFixed(1);

		//column 2 brackets
		//create text version for show and use pct for arrow calcs
		d['#affected+killed+new+pct+txt+weekly'] = Math.round(d['#affected+killed+new+pct+weekly']*100);

		if(d['#affected+killed+new+pct+txt+weekly']>0.5){
			d['#affected+killed+new+pct+txt+weekly'] = '+'+d['#affected+killed+new+pct+txt+weekly']+'%';
		} else {
			d['#affected+killed+new+pct+txt+weekly'] = d['#affected+killed+new+pct+txt+weekly']+'%';
		}

		if(d['#affected+killed+new+pct+weekly']=='inf'){
			d['#affected+killed+new+pct+weekly']==1000
			d['#affected+killed+new+pct+txt+weekly'] = 'INF';
		}

		//column 3
		if(d['#capacity+delivered+doses+total']==undefined){
			d['#capacity+delivered+doses+total'] = 'No Data'
		} else {
			d['#capacity+delivered+doses+total'] = numberWithCommas(Math.round(d['#capacity+delivered+doses+total']));
		}

		//column 4
		if(d['#targeted+delivered+doses+pct']==undefined){
			d['#targeted+delivered+doses+pct'] = 'No Data'
		} else {
			d['#targeted+delivered+doses+pct'] = Math.round(d['#targeted+delivered+doses+pct']*100)+'%';
		}

		//column 5
		if(d['#capacity+administered+doses+total']==undefined){
			d['#capacity+administered+doses+total'] = 'No Data'
		} else {
			d['#capacity+administered+doses+total'] = numberWithCommas(Math.round(d['#capacity+administered+doses+total']));
		}

		//column 6
		if(d['#impact+type']==undefined){
			d['#impact+type'] = 'No Data'
		}
		if(d['#impact+type']=='Closed due to COVID-19'){
			d['#impact+type'] = 'Closed'
		}

		//column 7
		if(d['#value+food+num+ratio']==undefined){
			d['#value+food+num+ratio']= 'No Data'
		} else {
			d['#value+food+num+ratio']= Math.round(d['#value+food+num+ratio']*100)+'%';
		}

		

		//column 8

		if(d['#value+funding+hrp+pct']==''){
			d['#value+funding+hrp+txt'] = 'No Data';
			d['#value+funding+hrp+pct'] = -1
		} else {
			d['#value+funding+hrp+txt'] = Math.round(d['#value+funding+hrp+pct']*100)+'%';
		}
		
	});
	
	return output;
}

function calcMax(data){
	config = {}
	for(key in data[0]){
		config[key] = 0;
	}
	data.forEach(function(d){
		for(key in config){
			if(parseFloat(d[key])>config[key]){
				config[key] = parseFloat(d[key]);
			}
		}
	});
	return config
}

function createTable(config,data){
	barKeys = ['#value+funding+hrp+pct'];
	data = data.sort(function(a,b){
		return parseFloat(b['#affected+avg+infected+per100000']) - parseFloat(a['#affected+avg+infected+per100000']);
	});
	console.log(data);
	console.log(config);
	//data = data.slice(0,18);
	data.forEach(function(d,i){
		let html = '<tr><td><span class="index">'+(i+1)+'</span>'+d['#country+name']+'</td>';
		html += '<td class="rightalign">'+d['#affected+infected+new+per100000+weekly']+'<span class="pctchange">('+d['#affected+infected+new+pct+txt+weekly']+')</span><img id="arrow_'+i+'" class="arrow" src="arrow.svg" height="20px"></td>';
		html += '<td class="rightalign">'+d['#affected+killed+new+per100000+weekly']+'<span class="pctchange">('+d['#affected+killed+new+pct+txt+weekly']+')</span><img id="arrow2_'+i+'" class="arrow" src="arrow.svg" height="20px"></td>';
		html += '<td class="rightalign">'+d['#capacity+delivered+doses+total']+'</td>';
		html += '<td class="rightalign">'+d['#targeted+delivered+doses+pct']+'</td>';
		html += '<td class="rightalign">'+d['#capacity+administered+doses+total']+'</td>';
		html += '<td class="rightalign">'+d['#impact+type']+'</td>';
		html += '<td class="rightalign">'+d['#value+food+num+ratio']+'</td>';
		html += '<td class="rightalign norightpad"><div id="bar_0_grey_'+i+'" class="bar greybar"></div><div id="bar_0_'+i+'" class="bar"></div></td><td class="rightalign noleftpad">'+(d['#value+funding+hrp+txt'])+'</td>';
		html += '</tr>';
		if(i<18){
			$('#maintable').append(html);
		} else {
			$('#maintable2').append(html);
		}
		

		barKeys.forEach(function(k,j){
			if(d[k]!=-1){
				let id = '#bar_'+(j)+'_'+i;
				let width = Math.floor(d[k]/config[k]*50);
				$(id).width(width);
				let greyID = '#bar_'+(j)+'_grey_'+i;
				let greyWidth = 50-width;
				$(greyID).width(greyWidth);
			}
		});

		let rotate = d['#affected+infected+new+pct+weekly']*10*-45;
		if(rotate<-45){
			rotate = -45
		}
		if(rotate>45){
			rotate = 45
		}
		$('#arrow_'+i).css({
	        "-webkit-transform": "rotate("+rotate+"deg)",
	        "-moz-transform": "rotate("+rotate+"deg)",
	        "transform": "rotate("+rotate+"deg)"
    	});

    	rotate = d['#affected+killed+new+pct+weekly']*10*-45;
		if(rotate<-45){
			rotate = -45
		}
		if(rotate>45){
			rotate = 45
		}
		$('#arrow2_'+i).css({
	        "-webkit-transform": "rotate("+rotate+"deg)",
	        "-moz-transform": "rotate("+rotate+"deg)",
	        "transform": "rotate("+rotate+"deg)"
    	});
	});
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function setDate(){
	var currentTime = new Date();
	let month = currentTime.toLocaleString('default', { month: 'long' });
	let day = currentTime.getDate();
	let year = currentTime.getFullYear();
	let time = currentTime.toUTCString().substring(17,22)
	let currentDate = day + ' ' + month + ' ' +  year +' ['+time+' UTC]';
	console.log(currentDate);
	$('#date').html(currentDate);
}

//load 3W data

let url = 'https://proxy.hxlstandard.org/data.json?dest=data_edit&filter01=select&select-query01-01=%23meta%2Bishrp%3DY&strip-headers=on&url=https://raw.githubusercontent.com/OCHA-DAP/hdx-scraper-covid-viz/who_epiweek/out_daily.json';

setDate();
loadData(url);