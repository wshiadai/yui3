YUI.add("attribute",function(B){B.State=function(){this.data={};};B.State.prototype={add:function(O,S){B.each(S,function(U,T){if(!this.data[T]){this.data[T]={};}this.data[T][O]=U;},this);},remove:function(S,U){var T=this.data,O=function(V){if(T[V]&&(S in T[V])){delete T[V][S];}};if(B.Lang.isString(U)){O(U);}else{B.each(U||T,function(W,V){if(B.Lang.isString(V)){O(V);}else{O(W);}},this);}},get:function(O,S){var U=this.data,T;if(S){return(U[S]&&O in U[S])?U[S][O]:undefined;}else{B.each(U,function(W,V){if(O in U[V]){T=T||{};T[V]=W[O];}},this);return T;}}};var J=B.Object,K=".",G="Change",M="get",F="set",E="getter",C="setter",I="value",Q="init",L="initValue",P="readOnly",H="writeOnce",D="validator",N,R=B.EventTarget;function A(){R.call(this,{emitFacade:true});this._conf=new B.State();}A.INVALID_VALUE={};N=A.INVALID_VALUE;A.prototype={addAttr:function(S,O){if(!this.attrAdded(S)){O=O||{};var U,T=(I in O);if(T){U=O.value;delete O.value;}O[Q]=true;this._conf.add(S,O);if(T){this.set(S,U);}}else{}return this;},attrAdded:function(O){return !!(this._conf.get(O,Q));},removeAttr:function(O){this._conf.remove(O);},get:function(T){var S=this._conf,U,O,V;if(T.indexOf(K)!==-1){U=T.split(K);T=U.shift();}V=S.get(T,I);O=S.get(T,E)||S.get(T,M);V=(O)?O.call(this,V):V;V=(U)?J.getValue(V,U):V;return V;},set:function(O,T,S){return this._setAttr(O,T,S);},reset:function(S){if(S){this._set(S,this._conf.get(S,L));}else{var O=this._conf.data.initValue;B.each(O,function(T,U){this._set(U,T);},this);}return this;},_set:function(O,T,S){return this._setAttr(O,T,S,true);},_setAttr:function(S,V,O,T){var a=this._conf,Y=a.data,X=true,W=(!Y.value||!(S in Y.value)),Z,b,U;if(S.indexOf(K)!==-1){Z=S;b=S.split(K);S=b.shift();}if(!W&&!T){if(a.get(S,H)){X=false;}if(a.get(S,P)){X=false;}}if(!a.get(S)){X=false;}U=this.get(S);if(b){V=J.setValue(B.clone(U),b,V);if(V===undefined){X=false;}}if(X){this._fireAttrChange(S,U,V,S,Z,O);}return this;},_fireAttrChange:function(U,W,O,S,X,V){U=U+G;this.publish(U,{queuable:false,defaultFn:this._defAttrChangeFn,silent:true});var T={type:U,prevVal:W,newVal:O,attrName:S,subAttrName:X};if(V){B.mix(T,V);}this.fire(T);},_defAttrChangeFn:function(X){var U=true,T=this._conf,S=X.attrName,Y=X.newVal,O=T.get(S,D),W=T.get(S,C)||T.get(S,F),V;if(!O||O.call(this,Y)){if(W){Y=W.call(this,Y);if(Y===N){U=false;}else{}}}else{U=false;}if(U){V={value:Y};if(T.get(S,L)===undefined){V[L]=Y;}T.add(S,V);X.newVal=T.get(S,I);}else{X.stopImmediatePropagation();}},setAttrs:function(S){for(var O in S){if(S.hasOwnProperty(O)){this.set(O,S[O]);}}return this;},getAttrs:function(U){var X={},V,S,O,W,T=(U===true);U=(U&&!T)?U:J.keys(this._conf.data[I]);for(V=0,S=U.length;V<S;V++){O=U[V];W=this.get(O);if(!T||this._conf.get(O,I)!=this._conf.get(O,L)){X[O]=this.get(O);}}return X;},addAttrs:function(S,T){if(S){var O,U,V;T=this._splitAttrVals(T);for(O in S){if(S.hasOwnProperty(O)){U=S[O];V=this._getAttrInitVal(O,U,T);if(V!==undefined){U.value=V;}this.addAttr(O,U);}}}return this;},_splitAttrVals:function(U){var W={},V={},X,O,T,S;for(S in U){if(U.hasOwnProperty(S)){if(S.indexOf(K)!==-1){X=S.split(K);O=X.shift();T=V[O]=V[O]||[];T[T.length]={path:X,value:U[S]};}else{W[S]=U[S];}}}return{simple:W,complex:V};},_getAttrInitVal:function(Y,W,a){var S=(W.valueFn)?W.valueFn.call(this):W.value,O,T,V,U,b,Z,X;if(!W[P]&&a){O=a.simple;if(O&&O.hasOwnProperty(Y)){S=O[Y];}T=a.complex;if(T&&T.hasOwnProperty(Y)){X=T[Y];for(V=0,U=X.length;V<U;++V){b=X[V].path;Z=X[V].value;J.setValue(S,b,Z);}}}return S;}};B.mix(A,R,false,null,1);B.Attribute=A;},"@VERSION@",{requires:["event-custom"]});