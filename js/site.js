function loadData(url){
	$.ajax({ 
	    type: 'GET', 
	    url: url, 
	    dataType: 'json',
	    success:function(response){
	        let dataHXL= hxlProxyToJSON(response);
	        init(dataHXL,data);
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
	config['#value+covid+funding+hrp+pct'] == 1;
	createTable(config,data);
}

function prepData(dataHXLProxy,data){
	let output = dataHXLProxy;
	output = addColumn(output,data,'national_data','#value+covid+funding+hrp+pct');
	output = output.filter(function(d){
		if(d['#value+covid+funding+hrp+pct']==undefined){
			return false
		} else {
			return true;
		}
	});
	output = addColumn(output,data,'national_data','#affected+inneed');
	return output;
}

function addColumn(output,data,rootKey,key){
	output.forEach(function(d){
		data[rootKey].forEach(function(d2){
			if(d['#country+code+v_iso3']==d2['#country+code']){
				d[key] = d2[key];
			}
		})
	});
	return output;
};

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
	keys = ['#indicator+newcases','#value+covid+funding+hrp+pct','#affected+inneed'];
	data = data.sort(function(a,b){
		return parseFloat(b['#indicator+newcases']) - parseFloat(a['#indicator+newcases']);
	});
	console.log(data);
	console.log(config);
	data.slice(0,10).forEach(function(d,i){
		console.log(d['#country+name']);
		let html = '<tr><td>'+d['#country+name']+'</td><td class="rightalign">'+d['#indicator+newcases']+'</td><td><img id="arrow_'+i+'" class="arrow" src="arrow.svg" height="20px"></td><td><bar id="bar_1_'+i+'"></bar></td><td class="rightalign">'+Math.round(d['#value+covid+funding+hrp+pct']*100)+'%</td><td><bar id="bar_2_'+i+'"></bar></td><td class="rightalign">'+Math.round(d['#affected+inneed'])+'</td><td><bar id="bar_3_'+i+'"></bar></td></tr>';
		$('#maintable').append(html);
		keys.forEach(function(k,j){
			let id = '#bar_'+(j+1)+'_'+i;
			let width = Math.floor(d[k]/config[k]*100);
			$(id).width(width);
		});
		let rotate = d['#indicator+newcaseschange']/10*-45;
		console.log(d['#indicator+newcaseschange']);
		console.log(rotate);
		if(rotate<-45){
			rotate = -45
		}
		if(rotate>45){
			rotate = 45
		}
		console.log(rotate);
		$('#arrow_'+i).css({
        "-webkit-transform": "rotate("+rotate+"deg)",
        "-moz-transform": "rotate("+rotate+"deg)",
        "transform": "rotate("+rotate+"deg)" /* For modern browsers(CSS3)  */
    });
	});
}


//load 3W data

let url = 'https://proxy.hxlstandard.org/data.json?dest=data_edit&filter01=select&select-query01-01=%23date%2Breported+is+max&filter02=cut&cut-skip-untagged02=on&filter03=merge&merge-url03=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F15L8loGDds69jzAb0v8H-o4Kkc_JIiszxmmP12g8S2iU%2Fedit%23gid%3D0&merge-keys03=%23country%2Bcode&merge-tags03=%23country%2Bname&strip-headers=on&url=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F190B8HBS9j2z1kxxpmYSm8p_zS16SXbljqJFa2t3ljHk%2Fedit%3Fusp%3Dsharing';

loadData(url);