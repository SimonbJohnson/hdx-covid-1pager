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
	output.forEach(function(d){
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
		if(d['#affected+pct+positive+tested']==''){
			d['#affected+pct+positive+tested']= 'No Data'
		} else {
			d['#affected+pct+positive+tested'] = Math.round(d['#affected+pct+positive+tested']*100) + '%'
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

	output.forEach(function(d){
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

		d['#affected+avg+change+infected+txt+per100000'] = Math.round(d['#affected+avg+change+infected+pct+per100000']);
		if(d['#affected+avg+change+infected+txt+per100000']>0.5){
			d['#affected+avg+change+infected+txt+per100000'] = '+'+d['#affected+avg+change+infected+txt+per100000']+'%';
		} else {
			d['#affected+avg+change+infected+txt+per100000'] = d['#affected+avg+change+infected+txt+per100000']+'%';
		}

		if(d['#affected+avg+change+infected+pct+per100000']=='inf'){
			d['#affected+avg+change+infected+pct+per100000']==1000
			d['#affected+avg+change+infected+txt+per100000'] = 'INF';
		}
	});

	output.forEach(function(d){
		d['#affected+avg+infected+per100000'] = (Math.round(d['#affected+avg+infected+per100000']*10)/10).toFixed(1);
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
	});
	
	return output;
}

/*function addColumn(output,data,rootKey,key){
	output.forEach(function(d){
		data[rootKey].forEach(function(d2){
			if(d['#country+code+v_iso3']==d2['#country+code']){
				d[key] = d2[key];
			}
		})
	});
	return output;
};*/

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
		let html = '<tr><td><span class="index">'+(i+1)+'</span>'+d['#country+name']+'</td>'
		html += '<td class="rightalign">'+d['#affected+avg+infected+per100000']+'<span class="pctchange">('+d['#affected+avg+change+infected+txt+per100000']+')</span><img id="arrow_'+i+'" class="arrow" src="arrow.svg" height="20px"></td>'
		html += '<td class="rightalign">'+d['#affected+avg+infected']+'</td>'
		html += '<td class="rightalign">'+d['#affected+avg+killed']+'<span class="pctchange">('+d['#affected+avg+change+killed+txt']+')</span><img id="arrow2_'+i+'" class="arrow" src="arrow.svg" height="20px"></td>'
		html += '<td class="rightalign">'+d['#affected+pct+positive+tested']+'</td>'
		html += '<td class="rightalign">'+d['#vaccination+num+ratio']+'</td>'
		html += '<td class="rightalign">'+d['#value+food+num+ratio']+'</td>'
		html += '<td class="rightalign"><div id="bar_0_grey_'+i+'" class="bar greybar"></div><div id="bar_0_'+i+'" class="bar"></div></td><td class="rightalign">'+(d['#value+funding+hrp+txt'])+'</td>'
		html += '</tr>';
		if(i<20){
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

		let rotate = d['#affected+avg+change+infected+pct+per100000']/10*-45;
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

    	rotate = d['#affected+avg+change+killed+pct']/10*-45;
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

let url = 'https://proxy.hxlstandard.org/data.json?dest=data_edit&filter01=select&select-query01-01=%23meta%2Bishrp%3DY&strip-headers=on&url=https%3A%2F%2Fraw.githubusercontent.com%2FOCHA-DAP%2Fhdx-scraper-covid-viz%2Fmaster%2Fout_daily.json';

setDate();
loadData(url);