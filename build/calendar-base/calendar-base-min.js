YUI.add("calendar-base",function(c){var C=c.ClassNameManager.getClassName,q="calendar",j=C(q,"grid"),d=C(q,"left-grid"),w=C(q,"right-grid"),y=C(q,"body"),p=C(q,"header"),m=C(q,"header-label"),r=C(q,"weekdayrow"),A=C(q,"weekday"),v=C(q,"column-hidden"),e=C(q,"day-selected"),g=C(q,"selection-disabled"),k=C(q,"row"),B=C(q,"day"),b=C(q,"prevmonth-day"),s=C(q,"nextmonth-day"),x=C(q,"anchor"),F=C(q,"pane"),i=c.Lang,t=c.Node,l=t.create,u=c.substitute,f=c.each,E=c.Array.hasValue,D=c.Object.hasKey,a=c.Object.setValue,h=c.Object.owns,o=c.Object.isEmpty,n=c.DataType.Date;function z(G){z.superclass.constructor.apply(this,arguments);}c.CalendarBase=c.extend(z,c.Widget,{_paneProperties:{},_paneNumber:1,_calendarId:c.guid(q),_selectedDates:{},_rules:{},_filterFunction:null,_storedDateCells:{},initializer:function(){},renderUI:function(){var G=this.get("contentBox");G.appendChild(this._initCalendarHTML(this.get("date")));if(this.get("showPrevMonth")){this._afterShowPrevMonthChange();}if(this.get("showNextMonth")){this._afterShowNextMonthChange();}this._renderCustomRules();this._renderSelectedDates();},bindUI:function(){this.after("dateChange",this._afterDateChange);this.after("showPrevMonthChange",this._afterShowPrevMonthChange);this.after("showNextMonthChange",this._afterShowNextMonthChange);this.after("headerRendererChange",this._afterHeaderRendererChange);this.after("customRendererChange",this._afterCustomRendererChange);this._bindCalendarEvents();},syncUI:function(){if(this.get("showPrevMonth")){this._afterShowPrevMonthChange();}if(this.get("showNextMonth")){this._afterShowNextMonthChange();}},_getSelectedDatesList:function(){var G=[];f(this._selectedDates,function(H){f(H,function(I){f(I,function(J){G.push(J);},this);},this);},this);return G;},_getSelectedDatesInMonth:function(H){var G=H.getFullYear(),I=H.getMonth();if(D(this._selectedDates,G)&&D(this._selectedDates[G],I)){return c.Object.values(this._selectedDates[G][I]);}else{return[];}},_renderSelectedDate:function(G){if(this._isDateVisible(G)){this._dateToNode(G).addClass(e);}},_renderUnselectedDate:function(G){if(this._isDateVisible(G)){this._dateToNode(G).removeClass(e);}},_isDateVisible:function(G){var H=this.get("date"),I=n.addMonths(H,this._paneNumber-1),J=this._normalizeDate(G).getTime();if(H.getTime()<=J&&J<=I){return true;}else{return false;}},_isNumInList:function(H,J){if(J=="all"){return true;}else{var I=J.split(",");for(val in I){var G=I[val].split("-");if(G.length==2&&H>=parseInt(G[0])&&H<=parseInt(G[1])){return true;}else{if(G.length==1&&(parseInt(I[val])==H)){return true;}}}return false;}},_getRulesForDate:function(J){var I=J.getFullYear(),L=J.getMonth(),H=J.getDate(),K=J.getDay(),M=this._rules,G=[];for(years in M){if(this._isNumInList(I,years)){if(i.isString(M[years])){G.push(M[years]);}else{for(months in M[years]){if(this._isNumInList(L,months)){if(i.isString(M[years][months])){G.push(M[years][months]);}else{for(dates in M[years][months]){if(this._isNumInList(H,dates)){if(i.isString(M[years][months][dates])){G.push(M[years][months][dates]);}else{for(days in M[years][months][dates]){if(this._isNumInList(K,days)){if(i.isString(M[years][months][dates][days])){G.push(M[years][months][dates][days]);}}}}}}}}}}}}return G;},_matchesRule:function(G,H){return(this._getRulesForDate(G).indexOf(H)>=0);},_canBeSelected:function(I){var G=this.get("enabledDatesRule"),H=this.get("disabledDatesRule");if(G){return this._matchesRule(I,G);}else{if(H){return !this._matchesRule(I,H);}else{return true;}}},selectDates:function(G){if(n.isValidDate(G)){this._addDateToSelection(G);}else{if(i.isArray(G)){this._addDatesToSelection(G);}}},deselectDates:function(G){if(G==null){this._clearSelection();}else{if(n.isValidDate(G)){this._removeDateFromSelection(G);}else{if(i.isArray(G)){this._removeDatesFromSelection(G);}}}},_addDateToSelection:function(J,H){if(this._canBeSelected(J)){var I=J.getFullYear(),K=J.getMonth(),G=J.getDate();if(D(this._selectedDates,I)){if(D(this._selectedDates[I],K)){this._selectedDates[I][K][G]=J;}else{this._selectedDates[I][K]={};this._selectedDates[I][K][G]=J;}}else{this._selectedDates[I]={};this._selectedDates[I][K]={};this._selectedDates[I][K][G]=J;}this._selectedDates=a(this._selectedDates,[I,K,G],J);this._renderSelectedDate(J);if(H==null){this._fireSelectionChange();}}},_addDatesToSelection:function(G){f(G,this._addDateToSelection,this);this._fireSelectionChange();},_addDateRangeToSelection:function(G,K){var I=G.getTime(),H=K.getTime();if(I>H){var L=I;I=H;H=L;}for(var J=I;J<=H;J+=86400000){this._addDateToSelection(new Date(J),J);}this._fireSelectionChange();},_removeDateFromSelection:function(J,H){var I=J.getFullYear(),K=J.getMonth(),G=J.getDate();if(D(this._selectedDates,I)&&D(this._selectedDates[I],K)&&D(this._selectedDates[I][K],G)){delete this._selectedDates[I][K][G];this._renderUnselectedDate(J);if(H==null){this._fireSelectionChange();}}},_removeDatesFromSelection:function(G){f(G,this._removeDateDromSelection);this._fireSelectionChange();},_removeDateRangeFromSelection:function(G,K){var I=G.getTime(),H=K.getTime();for(var J=I;J<=H;J+=86400000){this._removeDateFromSelection(new Date(J),J);}this._fireSelectionChange();},_clearSelection:function(G){this._selectedDates={};this.get("contentBox").all("."+e).removeClass(e);if(!G){this._fireSelectionChange();}},_fireSelectionChange:function(){this.fire("selectionChange",{newSelection:this._getSelectedDatesList()});},_restoreModifiedCells:function(){var G=this.get("contentBox");for(id in this._storedDateCells){G.one("#"+id).replace(this._storedDateCells[id]);delete this._storedDateCells[id];}},_renderCustomRules:function(){this.get("contentBox").all("."+B+",."+s).removeClass(g);if(!o(this._rules)){var J=this.get("enabledDatesRule"),I=this.get("disabledDatesRule");for(var H=0;H<this._paneNumber;H++){var G=n.addMonths(this.get("date"),H);var K=n.listOfDatesInMonth(G);f(K,function(L){var N=this._getRulesForDate(L);if(N.length>0){var M=this._dateToNode(L);if((J&&!(N.indexOf(J)>=0))||(I&&(N.indexOf(I)>=0))){M.addClass(g);
}if(i.isFunction(this._filterFunction)){this._storedDateCells[M.get("id")]=M.cloneNode(true);this._filterFunction(L,M,N);}}},this);}}},_renderSelectedDates:function(){this.get("contentBox").all("."+e).removeClass(e);for(var H=0;H<this._paneNumber;H++){var G=n.addMonths(this.get("date"),H);var I=this._getSelectedDatesInMonth(G);f(I,function(J){this._dateToNode(J).addClass(e);},this);}},_dateToNode:function(M){var G=M.getDate(),I=0,J=G%7,K=(12+M.getMonth()-this.get("date").getMonth())%12,H=this._calendarId+"_pane_"+K,L=this._paneProperties[H].cutoffCol;switch(J){case (0):if(L>=6){I=12;}else{I=5;}break;case (1):I=6;break;case (2):if(L>0){I=7;}else{I=0;}break;case (3):if(L>1){I=8;}else{I=1;}break;case (4):if(L>2){I=9;}else{I=2;}break;case (5):if(L>3){I=10;}else{I=3;}break;case (6):if(L>4){I=11;}else{I=4;}break;}return(this.get("contentBox").one("#"+this._calendarId+"_pane_"+K+"_"+I+"_"+G));},_nodeToDate:function(K){var H=K.get("id").split("_"),I=parseInt(H[8]),G=parseInt(H[10]);var J=n.addMonths(this.get("date"),I);year=J.getFullYear();month=J.getMonth();return new Date(year,month,G,12,0,0,0);},_bindCalendarEvents:function(){},_normalizeDate:function(G){return new Date(G.getFullYear(),G.getMonth(),1,12,0,0,0);},_getCutoffColumn:function(H,I){var J=this._normalizeDate(H).getDay()-I;var G=6-(J+7)%7;return G;},_turnPrevMonthOn:function(K){var J=K.get("id"),H=this._paneProperties[J].paneDate,I=n.daysInMonth(n.addMonths(H,-1));if(!this._paneProperties[J].hasOwnProperty("daysInPrevMonth")){this._paneProperties[J].daysInPrevMonth=0;}if(I!=this._paneProperties[J].daysInPrevMonth){this._paneProperties[J].daysInPrevMonth=I;for(var G=5;G>=0;G--){K.one("#"+J+"_"+G+"_"+(G-5)).setContent(I--);}}},_turnPrevMonthOff:function(I){var H=I.get("id");this._paneProperties[H].daysInPrevMonth=0;for(var G=5;G>=0;G--){I.one("#"+H+"_"+G+"_"+(G-5)).setContent("&nbsp;");}},_cleanUpNextMonthCells:function(H){var G=H.get("id");H.one("#"+G+"_6_29").removeClass(s);H.one("#"+G+"_7_30").removeClass(s);H.one("#"+G+"_8_31").removeClass(s);H.one("#"+G+"_0_30").removeClass(s);H.one("#"+G+"_1_31").removeClass(s);},_turnNextMonthOn:function(M){var H=1,L=M.get("id"),I=this._paneProperties[L].daysInMonth,K=this._paneProperties[L].cutoffCol;for(var G=I-22;G<K+7;G++){M.one("#"+L+"_"+G+"_"+(G+23)).setContent(H++).addClass(s);}var J=K;if(I==31&&(K<=1)){J=2;}else{if(I==30&&K==0){J=1;}}for(var G=J;G<K+7;G++){M.one("#"+L+"_"+G+"_"+(G+30)).setContent(H++).addClass(s);}},_turnNextMonthOff:function(L){var K=L.get("id"),H=this._paneProperties[K].daysInMonth,J=this._paneProperties[K].cutoffCol;for(var G=H-22;G<=12;G++){L.one("#"+K+"_"+G+"_"+(G+23)).setContent("&nbsp;").addClass(s);}var I=0;if(H==31&&(J<=1)){I=2;}else{if(H==30&&J==0){I=1;}}for(var G=I;G<=12;G++){L.one("#"+K+"_"+G+"_"+(G+30)).setContent("&nbsp;").addClass(s);}},_afterShowNextMonthChange:function(){var G=this.get("contentBox"),H=G.one("#"+this._calendarId+"_pane_"+(this._paneNumber-1));this._cleanUpNextMonthCells(H);if(this.get("showNextMonth")){this._turnNextMonthOn(H);}else{this._turnNextMonthOff(H);}},_afterShowPrevMonthChange:function(){var H=this.get("contentBox"),G=H.one("#"+this._calendarId+"_pane_"+0);if(this.get("showPrevMonth")){this._turnPrevMonthOn(G);}else{this._turnPrevMonthOff(G);}},_afterHeaderRendererChange:function(){var G=this.get("contentBox").one("."+p).one("h4");G.setContent(this._updateCalendarHeader(this.get("date")));},_afterCustomRendererChange:function(){this._renderCustomRules();},_afterDateChange:function(){var I=this.get("contentBox"),K=I.one("."+p).one("h4"),J=I.all("."+j),H=this.get("date"),G=0;I.setStyle("visibility","hidden");K.setContent(this._updateCalendarHeader(H));this._restoreModifiedCells();J.each(function(L){this._rerenderCalendarPane(n.addMonths(H,G++),L);},this);this._afterShowPrevMonthChange();this._afterShowNextMonthChange();this._renderCustomRules();this._renderSelectedDates();I.setStyle("visibility","visible");},_initCalendarPane:function(J,M){var T="",V=this.get("strings.very_short_weekdays")||["Su","Mo","Tu","We","Th","Fr","Sa"],G=this.get("strings.first_weekday")||0,R=this._getCutoffColumn(J,G),H=n.daysInMonth(J),Q=["","","","","",""],O={};O["weekday_row"]="";for(var S=G;S<=G+6;S++){O["weekday_row"]+=u(z.WEEKDAY_TEMPLATE,{weekdayname:V[S%7]});}O["weekday_row_template"]=u(z.WEEKDAY_ROW_TEMPLATE,O);for(var W=0;W<=5;W++){for(var L=0;L<=12;L++){var K=7*W-5+L;var P=M+"_"+L+"_"+K;var U=B;if(K<1){U=b;}else{if(K>H){U=s;}}if(K<1||K>H){K="&nbsp;";}var N=(L>=R&&L<(R+7))?"":v;Q[W]+=u(z.CALDAY_TEMPLATE,{day_content:K,calendar_col_class:"calendar_col"+L,calendar_col_visibility_class:N,calendar_day_class:U,calendar_day_id:P});}}O["body_template"]="";f(Q,function(X){O["body_template"]+=u(z.CALDAY_ROW_TEMPLATE,{calday_row:X});});O["calendar_pane_id"]=M;var I=u(u(z.CALENDAR_GRID_TEMPLATE,O),z.CALENDAR_STRINGS);this._paneProperties[M]={cutoffCol:R,daysInMonth:H,paneDate:J};return I;},_rerenderCalendarPane:function(N,I){var G=this.get("strings.first_weekday")||0,M=this._getCutoffColumn(N,G),H=n.daysInMonth(N),K=I.get("id");I.setStyle("visibility","hidden");for(var J=0;J<=12;J++){var L=I.all("."+"calendar_col"+J);L.removeClass(v);if(J<M||J>=(M+7)){L.addClass(v);}else{switch(J){case 0:var O=I.one("#"+K+"_0_30");if(H>=30){O.setContent("30");O.removeClass(s).addClass(B);}else{O.setContent("&nbsp;");O.addClass(s).addClass(B);}break;case 1:var O=I.one("#"+K+"_1_31");if(H>=31){O.setContent("31");O.removeClass(s).addClass(B);}else{O.setContent("&nbsp;");O.removeClass(B).addClass(s);}break;case 6:var O=I.one("#"+K+"_6_29");if(H>=29){O.setContent("29");O.removeClass(s).addClass(B);}else{O.setContent("&nbsp;");O.removeClass(B).addClass(s);}break;case 7:var O=I.one("#"+K+"_7_30");if(H>=30){O.setContent("30");O.removeClass(s).addClass(B);}else{O.setContent("&nbsp;");O.removeClass(B).addClass(s);}break;case 8:var O=I.one("#"+K+"_8_31");if(H>=31){O.setContent("31");O.removeClass(s).addClass(B);}else{O.setContent("&nbsp;");O.removeClass(B).addClass(s);}break;}}}this._paneProperties[K].cutoffCol=M;
this._paneProperties[K].daysInMonth=H;this._paneProperties[K].paneDate=N;I.setStyle("visibility","visible");},_updateCalendarHeader:function(I){var H="",G=this.get("headerRenderer");if(c.Lang.isString(G)){H=n.format(I,{format:G});}else{if(G instanceof Function){H=G.call(this,I);}}return H;},_initCalendarHeader:function(G){return u(u(z.HEADER_TEMPLATE,{calheader:this._updateCalendarHeader(G)}),z.CALENDAR_STRINGS);},_initCalendarHTML:function(J){var I={},G=0;I["header_template"]=this._initCalendarHeader(J);I["calendar_id"]=this._calendarId;I["body_template"]=u(u(z.CONTENT_TEMPLATE,I),z.CALENDAR_STRINGS);function K(){var L=this._initCalendarPane(n.addMonths(J,G),I["calendar_id"]+"_pane_"+G);G++;return L;}var H=I["body_template"].replace(/\{calendar_grid_template\}/g,c.bind(K,this));this._paneNumber=G;return H;}},{CALENDAR_STRINGS:{calendar_grid_class:j,calendar_body_class:y,calendar_hd_class:p,calendar_hd_label_class:m,calendar_weekdayrow_class:r,calendar_weekday_class:A,calendar_row_class:k,calendar_day_class:B,calendar_dayanchor_class:x,calendar_pane_class:F,calendar_right_grid_class:w,calendar_left_grid_class:d},CONTENT_TEMPLATE:'<div class="yui3-g {calendar_pane_class}" id="{calendar_id}">'+"{header_template}"+'<div class="yui3-u-1">'+"{calendar_grid_template}"+"</div>"+"</div>",ONE_PANE_TEMPLATE:'<div class="yui3-g {calendar_pane_class}" id="{calendar_id}">'+"{header_template}"+'<div class="yui3-u-1 yui3-calendar-main-grid">'+"{calendar_grid_template}"+"</div>"+"</div>",TWO_PANE_TEMPLATE:'<div class="yui3-g {calendar_pane_class}" id="{calendar_id}">'+"{header_template}"+'<div class="yui3-u-1-2">'+'<div class = "{calendar_left_grid_class}">'+"{calendar_grid_template}"+"</div>"+"</div>"+'<div class="yui3-u-1-2">'+'<div class = "{calendar_right_grid_class}">'+"{calendar_grid_template}"+"</div>"+"</div>"+"</div>",THREE_PANE_TEMPLATE:'<div class="yui3-g {calendar_pane_class}" id="{calendar_id}">'+"{header_template}"+'<div class="yui3-u-1-3">'+'<div class = "{calendar_left_grid_class}">'+"{calendar_grid_template}"+"</div>"+"</div>"+'<div class="yui3-u-1-3">'+"{calendar_grid_template}"+"</div>"+'<div class="yui3-u-1-3">'+'<div class = "{calendar_right_grid_class}">'+"{calendar_grid_template}"+"</div>"+"</div>"+"</div>",CALENDAR_GRID_TEMPLATE:'<table class="{calendar_grid_class}" id="{calendar_pane_id}">'+"<thead>"+"{weekday_row_template}"+"</thead>"+"<tbody>"+"{body_template}"+"</tbody>"+"</table>",HEADER_TEMPLATE:'<div class="yui3-g {calendar_hd_class}">'+'<div class="yui3-u {calendar_hd_label_class}">'+"<h4>"+"{calheader}"+"</h4>"+"</div>"+"</div>",WEEKDAY_ROW_TEMPLATE:'<tr class="{calendar_weekdayrow_class}">'+"{weekday_row}"+"</tr>",CALDAY_ROW_TEMPLATE:'<tr class="{calendar_row_class}">'+"{calday_row}"+"</tr>",WEEKDAY_TEMPLATE:'<th class="{calendar_weekday_class}">{weekdayname}</th>',CALDAY_TEMPLATE:'<td class="{calendar_col_class} {calendar_day_class} {calendar_col_visibility_class}" id="{calendar_day_id}">'+"{day_content}"+"</td>",NAME:"calendarBase",ATTRS:{date:{value:new Date(),setter:function(H){var G=this._normalizeDate(H);if(n.areEqual(G,this.get("date"))){return this.get("date");}}},showPrevMonth:{value:false},showNextMonth:{value:false},strings:{valueFn:function(){return c.Intl.get("calendar-base");}},headerRenderer:{value:"%B %Y"},enabledDatesRule:{value:null},disabledDatesRule:{value:null},selectedDates:{readOnly:true,getter:function(G){return(this._getSelectedDatesList());}},customRenderer:{value:{},setter:function(G){this._rules=G.rules;this._filterFunction=G.filterFunction;}}}});},"@VERSION@",{lang:["en","ru"],requires:["widget","substitute","datatype-date","datatype-date-math","cssgrids"]});