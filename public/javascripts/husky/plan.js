Ext.ns('Example');

Ext.BLANK_IMAGE_URL = 'images/s.gif';
Ext.QuickTips.init();



var store = new Ext.data.GroupingStore({
    url: 'plan/controller_config',
    sortInfo: {
        field: 'section'
    },
    autoLoad: true,
    groupField: 'section',
    reader: new Ext.data.JsonReader({
        root:'rows'
    }, [
    'key',
    'value',
    'section',
    ])
});
store.load();

/**
 * @class Example.Grid
 * @extends Ext.grid.GridPanel
 */
Example.Grid = Ext.extend(Ext.grid.GridPanel, {

    // configurables
    border:false

    // {{{
    ,
    initComponent:function() {

        // hard coded - cannot be changed from outside
        var config = {
            // store
            store:store,

            // column model
            frame:true,
            title: 'TAF Controller Configuration',
            height:500,
            width:900,

            columns: [
            {
                header: "section",
                width: 100,
                dataIndex: 'section'
            },

            {
                header: "key",
                width: 100,
                dataIndex: 'key' 
            },

            {
                header: "value",
                width: 700,
                dataIndex: 'value'
            },
            ],
            view: new Ext.grid.GroupingView(),
            collapsible: true,
            animCollapse: true,
           

        // force fit
        //            viewConfig:{
        //                forceFit:true,
        //                scrollOffset:0
        //            }
        //

        // tooltip template
            
        //            qtipTpl:new Ext.XTemplate(
        //                '<h3>Phones:</h3>'
        //                ,'<tpl for=".">'
        //                ,'<div><i>{phoneType}:</i> {phoneNumber}</div>'
        //                ,'</tpl>'
        //                )
        }; // eo config object

        // apply config
        Ext.apply(this, Ext.apply(this.initialConfig, config));

        // call parent
        Example.Grid.superclass.initComponent.apply(this, arguments);

    } // eo function initComponent
    // }}}
    // {{{
    ,
    onRender:function() {

        // call parent
        Example.Grid.superclass.onRender.apply(this, arguments);

        // load store
        this.store.load();

    } // eo function onRender
// }}}
// {{{
/**
	 * Last Name rederer including tooltip with phones
	 * @param {Mixed} val Value to render
	 * @param {Object} cell
	 * @param {Ext.data.Record} record
	 */
 
//    renderLastName:function(val, cell, record) {
//
//        // get data
//        var data = record.data;
//
//        // convert phones to array (only once)
//        data.phones = Ext.isArray(data.phones) ? data.phones : this.getPhones(data.phones);
//
//        // create tooltip
//        var qtip = this.qtipTpl.apply(data.phones);
//
//        // return markup
//        return '<div qtip="' + qtip +'">' + val + '</div>';
//    } // eo function renderLastName
// }}}
// {{{
/**
	 * Converts string phones to array of objects
	 * @param {String} phones
	 * @return {Array} Array of phone objects
	 */

//    getPhones:function(phones) {
//
//        // empty array if nothing to do
//        if(!phones) {
//            return [];
//        }
//
//        // init return value
//        var retval = [];
//
//        // split string to phones
//        var aps = phones.split('|');
//
//        // iterate through phones to extract phoneType and phoneNumber
//        Ext.each(aps, function(phone) {
//            var a = phone.split('~');
//            retval.push({
//                phoneType:a[0],
//                phoneNumber:a[1]
//            });
//        });
//
//        return retval;
//    } // eo function getPhones
// }}}

}); // eo extend

// register xtype
Ext.reg('testconfig_grid', Example.Grid);







// application main entry point
//Ext.onReady(function() {
//
//    // initialize
//    Ext.QuickTips.init();
//
//    // create and show window
//    var win = new Ext.Panel({
//        width:700
//        ,
//        height:500
//        ,
//        id:'one2many-win'
//        ,
//        layout:'accordion'
//        ,
//        autoScroll:true
//        ,
//        animCollapse : true,
//        renderTo: 'property',
//        //        title:Ext.getDom('page-title').innerHTML
//        //        ,
//        items:[{
//            xtype:'testconfig_grid',
//            id:'one2many-grid'
//        }, {
//            xtype:'testconfig_grid',
//            id:'ss-grid'
//        }, {
//            xtype:'testconfig_grid',
//            id:'ss-gsdfrid'
//        }, {
//            xtype:'testconfig_grid',
//            id:'ss-grsdfsid'
//        }
//        ]
//    });
//    win.show();
//
//}); // eo function onReady

// eof



function construct_monitor_panel(treePan){

    _treePanel = {
        region: 'west',
        collapsible: true,
        width: 100,
//        collapseMode: 'mini',
        split: true,
        items: [
            treePan
        ]

    };

    _infoPanel = {
        region: 'center',
        xtype: 'tabpanel',
        activeTab: 0,
        title: 'Test Controller Information',
        items: [
        {
            xtype: 'testconfig_grid',
            id: 'test_config'
        }
        ]
    };
    
    bg_panel = new Ext.Panel({
        layout: 'border',
        renderTo: 'detail-page',
        defaults: {
            frame: true,
            split: true
        },
        height: 400,
        width: 600,
        collapsible: true,
        items: [
        _treePanel,
        _infoPanel
        ]
    });

}


Ext.onReady(function(){

   

    //    var grid = new Ext.grid.GridPanel({
    //        renderTo: 'controller_config',
    //        frame:true,
    //        title: 'TAF Controller Configuration',
    //        height:500,
    //        width:700,
    //        store: store,
    //
    //        columns: [
    //        {
    //            header: "section",
    //            width: 100,
    //            dataIndex: 'section'
    //        },
    //
    //        {
    //            header: "key",
    //            width: 100,
    //            dataIndex: 'key'
    //        },
    //
    //        {
    //            header: "value",
    //            width: 500,
    //            dataIndex: 'value'
    //        },
    //        ],
    //        view: new Ext.grid.GroupingView(),
    //        collapsible: true,
    //        animCollapse: false
    //    });

      

    clickListener = function (node,event){
        // The node argument represents the node that
        // was clicked on within your TreePanel
        alert('You Clicked ' + node);

        store.reload({
            params: {
                machine_id: node.attributes.id
            },
            callback: function(r, options, success) {
       
            }

        });
    };


    // create initial root node
    root = new Ext.tree.AsyncTreeNode({
        text: 'Test Controllers',
        id:'0'
    });
    // create the tree
    var tPan = new Ext.tree.TreePanel({
        loader: new Ext.tree.TreeLoader({
            url:'/plan/machines',
            requestMethod:'GET',
            baseParams:{
                format:'json'
            }
        }),
        renderTo:'machine-tree',
        root: root,
        rootVisible:true,
        id:'controller-list',
        listeners: {
            click: {
                fn:clickListener
            }
        }

    });
    // expand invisible root node to trigger load
    // of the first level of actual data
//    root.expand();

    construct_monitor_panel(tPan);

});
