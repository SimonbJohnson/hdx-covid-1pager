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
	output.forEach(function(d){
		if(d['#value+covid+funding+hrp+pct']==undefined){
			d['#value+covid+funding+hrp+txt'] = '-';
			d['#value+covid+funding+hrp+pct'] = 0
		} else {
			d['#value+covid+funding+hrp+txt'] = Math.round(d['#value+covid+funding+hrp+pct']*100)+'%';
		}
	});
	output = addColumn(output,data,'national_data','#affected+inneed');
	output.forEach(function(d){
		if(d['#affected+inneed']==undefined){
			d['#affected+inneed'] = '-';
		} else {
			d['#affected+inneed'] = numberWithCommas(d['#affected+inneed']);
		}
	});
	output = addColumn(output,data,'national_data','#affected+tested+per1000');
	output.forEach(function(d){
		if(d['#affected+tested+per1000']==undefined){
			d['#affected+tested+per1000']= ''
		}
	});
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
	barKeys = ['#indicator+ht+newcases','#indicator+newcases','#value+covid+funding+hrp+pct'];
	data = data.sort(function(a,b){
		return parseFloat(b['#indicator+ht+newcases']) - parseFloat(a['#indicator+ht+newcases']);
	});
	console.log(data);
	console.log(config);
	data.slice(0,15).forEach(function(d,i){
		console.log(d['#country+name']);
		let html = '<tr><td><span class="index">'+(i+1)+'</span>'+d['#country+name']+'</td>'
		html += '<td class="rightalign"><div id="bar_0_'+i+'" class="bar"></bar></td><td class="rightalign">'+(numberWithCommas(Math.round(d['#indicator+ht+newcases']*10)/10))+'</td><td class="minpadding"><img id="arrow_'+i+'" class="arrow" src="arrow.svg" height="20px"></td>'
		html += '<td class="rightalign"><div id="bar_1_'+i+'" class="bar"></div></td><td class="rightalign">'+(numberWithCommas(d['#indicator+newcases']))+'</td>'
		html += '<td class="rightalign">'+(numberWithCommas(d['#indicator+cumulative+deaths']))+'</td>'
		html += '<td class="rightalign">'+(numberWithCommas(d['#indicator+newdeaths']))+'</td>'
		html += '<td class="rightalign">'+Math.round(d['#affected+tested+per1000'])+'</td>'
		html += '<td class="rightalign"><div id="bar_2_'+i+'" class="bar"></div></td><td class="rightalign">'+(d['#value+covid+funding+hrp+txt'])+'</td>'
		html += '<td class="rightalign">'+d['#affected+inneed']+'</td>'
		html += '</tr>';
		$('#maintable').append(html);
		barKeys.forEach(function(k,j){
			let id = '#bar_'+(j)+'_'+i;
			let width = Math.floor(d[k]/config[k]*50);
			$(id).width(width);
		});
		let rotate = d['#indicator+newcaseschange']/10*-45;
		if(rotate<-45){
			rotate = -45
		}
		if(rotate>45){
			rotate = 45
		}
		$('#arrow_'+i).css({
	        "-webkit-transform": "rotate("+rotate+"deg)",
	        "-moz-transform": "rotate("+rotate+"deg)",
	        "transform": "rotate("+rotate+"deg)" /* For modern browsers(CSS3)  */
    	});
	});
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//load 3W data

let url = 'https://proxy.hxlstandard.org/data.json?dest=data_edit&filter01=select&select-query01-01=%23date%2Breported+is+max&filter02=cut&cut-skip-untagged02=on&filter03=merge&merge-url03=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F15L8loGDds69jzAb0v8H-o4Kkc_JIiszxmmP12g8S2iU%2Fedit%23gid%3D0&merge-keys03=%23country%2Bcode&merge-tags03=%23country%2Bname&strip-headers=on&url=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F190B8HBS9j2z1kxxpmYSm8p_zS16SXbljqJFa2t3ljHk%2Fedit%3Fusp%3Dsharing';

loadData(url);