
Ext.ns('Husky');
Ext.BLANK_IMAGE_URL = 'ext/resources/images/default/s.gif';

var config_store = new Ext.data.GroupingStore({
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
//config_store.load();

/**
 * @class Example.Grid
 * @extends Ext.grid.GridPanel
 */
Husky.IniGrid = Ext.extend(Ext.grid.EditorGridPanel, {

    // configurables
    border:false

    // {{{
    ,
    initComponent:function() {

        var value_editor = new Ext.form.TextField();
        // hard coded - cannot be changed from outside
        var config = {
            // store
            store:config_store,

            // column model
            frame:true,
            title: 'TAF Controller Configuration',
            height:500,
            width:500,
            columns: [
            {
                header: "section",
                width: 100,
                dataIndex: 'section'
            },

            {
                header: "key",
                width: 100,
                dataIndex: 'key',
            },

            {
                header: "value",
                width: 500,
                dataIndex: 'value',
                editor: value_editor
            },
            ],
            view: new Ext.grid.GroupingView(),
            collapsible: true,
            animCollapse: true
            ,
            clicksToEdit: 1
            ,
            listeners: {
                afteredit: function(e){
                    if (e.value == 'kevinyoung'){
                        Ext.Msg.alert('Error','kevin movies not allowed');
                        e.record.reject();
                    }else{
                        e.record.commit();
                    }
                }
            }

        }; // eo config object

        // apply config
        Ext.apply(this, Ext.apply(this.initialConfig, config));

        // call parent
        Husky.IniGrid.superclass.initComponent.apply(this, arguments);

    } // eo function initComponent
    ,
    onRender:function() {

        // call parent
        Husky.IniGrid.superclass.onRender.apply(this, arguments);

        // load store
        this.store.load({
            params: {
                //                machine_id: node.attributes.id
                machine_id: 2
            }
        });

    } // eo function onRender

}); // eo extend

// register xtype
Ext.reg('ini_grid', Husky.IniGrid);

// {{{
// example grid extension
Husky.Grid = Ext.extend(Ext.grid.GridPanel, {
    initComponent:function() {
        var config = {
            store:new Ext.data.JsonStore({
                id:'module_store'
                ,
                totalProperty:'totalCount'
                ,
                root:'rows'
                ,
                url:'plan/pmodules'
                ,
                fields:[
                {
                    name:'name'
                }
                ,{
                    name:'id'
                }
                ,{
                    name:'owner'
                }
                ,{
                    name:'machine_ip'
                }
                ]
            })
            ,
            columns:[
//                {
//                id:'id'
//                ,
//                header:"id"
//                ,
//                width:20,
//                sortable:true
//                ,
//                dataIndex:'id'
//            },
            {
                header:"module"
                ,
                width:40
                ,
                sortable:true
                ,
                dataIndex:'name'
            },{
                header:"owner"
                ,
                width:40
                ,
                sortable:true
                ,
                dataIndex:'owner'
            },{
                header:"run_at"
                ,
                width:40
                ,
                sortable:true
                ,
                dataIndex:'machine_ip'
            }]
            ,
            viewConfig:{
                forceFit:true
            }
        }; // eo config object

        // apply config
        Ext.apply(this, Ext.apply(this.initialConfig, config));

        this.bbar = new Ext.PagingToolbar({
            store:this.store
            ,
            displayInfo:true
            ,
            pageSize:30
        });
        // call parent
        Husky.Grid.superclass.initComponent.apply(this, arguments);
    } // eo function initComponent

    ,
    onRender:function() {

        // call parent
        Husky.Grid.superclass.onRender.apply(this, arguments);

        // load the store
        this.store.load({
            params:{
                start:0,
                limit:30
            }
        });

    } // eo function onRender

});
Ext.reg('module-grid', Husky.Grid);
// }}}

//clickListener = function (node,event){
//    // The node argument represents the node that
//    // was clicked on within your TreePanel
//    alert('You Clicked ' + node);
//
//    store.reload({
//        params: {
//            machine_id: node.attributes.id
//        },
//        callback: function(r, options, success) {
//
//        }
//
//    });
//};


// application main entry point
Ext.onReady(function() {

    // initialize QuickTips
    Ext.QuickTips.init();

    // create initial root node
    root = new Ext.tree.AsyncTreeNode({
        text: 'Test Controllers',
        id:'treeroot',
        isTarget:false,
        enableDD: false
    });    
    // {{{
    // create DD enabled tree in the east
    // Note: It can be also an extension as the grid is
    var tree = new Ext.tree.TreePanel({
        loader: new Ext.tree.TreeLoader({
            url:'/plan/pmachines',
            requestMethod:'GET',
            baseParams:{
                format:'json',
                preloadChildren:true
            }
        }),
        //        renderTo:'machine-tree',
        root: root,
        rootVisible:true,
        id:'machines-list',
        //        listeners: {
        //            click: {
        //        //                fn:clickListener
        //        }
        //        }

        // root with some static demo nodes
		
        // preloads 1st level children
        //		,loader:new Ext.tree.TreeLoader({})

        // enable DD        
        enableDD:true
        // set ddGroup - same as for grid
        ,
        ddGroup:'grid2tree'
		
        ,
        region:'east'
        ,
        title:'Machine Tree'
        ,
        layout:'fit'
        ,
        width:300
        ,
        split:true
        ,
        collapsible:true
        ,
        autoScroll:true
        ,
        listeners:{
            beforemovenode: {
                fn:function(tree, node, oldParent, newParent, index) {
                    if (newParent == root) {
                        alert("not allowed to move to Root");
                        return false;
                    }
                }
            },
            
            movenode: {
                fn:function(tree, node, oldParent, newParent, index) {
                    // update binding mapping.
                    Ext.Ajax.request({
                        url: 'plan/bind',
                        params: {
                            module_id: node.id,
                            machine_id: newParent.id
                        },
                        callback :function(option,success,response){
                            if(success){//
                                //alert('yes');
                                Ext.getCmp('grid').getStore().reload({
                                    params: {
                                        start: 0,
                                        limit: 30
                                    },
                                });
                                return true;
                            }
                            return false;
                        }
                    });

                    

                    
                    if (newParent == root) {
                        alert("not allowed to move to Root");
                        return false;
                    }
                }
            },

            // create nodes based on data from grid
            beforenodedrop:{
                fn:function(e) {

                    // e.data.selections is the array of selected records
                    if(e.point == "append" && Ext.isArray(e.data.selections)) {
                       
                        // reset cancel flag
                        e.cancel = false;



                        // setup dropNode (it can be array of nodes)
                        e.dropNode = [];
                        var r;
                        var changed = false;
                        for(var i = 0; i < e.data.selections.length; i++) {

                            // get record from selectons
                            r = e.data.selections[i];

                            // skip it, if r already exists in children
                            var already_exist = false;
                            for(var j=0; j < e.target.childNodes.length; j++) {
                                if (r.get('name') == e.target.childNodes[j].text)
                                {
                                    already_exist = true;
                                    break;
                                }
                            }

                            if(already_exist == true) {
                                continue;
                            }
                                
                                
                            // fire Ajax request to update machine-module mappings
                            Ext.Ajax.request({
                                url: 'plan/bind',
                                params: {
                                    module_id: r.get('id'),
                                    machine_id: e.target.attributes.id
                                //                                    nodeid: node.attributes.id,
                                //                                    newparentid: newParent.id,
                                //                                    oldparentid: oldParent.id,
                                //                                    dropindex: index
                                },
                                callback :function(option,success,response){
                                    if(success){//
                                        //alert('yes');
                                        Ext.getCmp('grid').getStore().reload({
                                            params: {
                                                start: 0,
                                                limit: 30
                                            },
                                        });
                                        return true;
                                    }
                                    return false;
                                }
                            });
                            
                            // create node from record data
                            e.dropNode.push(this.loader.createNode({
                                text:r.get('name'),
                                id: r.id,
                                leaf:true,
                                isTarget:false,
                                qtip:r.get('name')
                            }));

                            changed = true;
                        }

                        // we want Ext to complete the drop, thus return true
                        if (changed == true)
                            return true;
                        else
                            return false;
                    }

                // if we get here the drop is automatically cancelled by Ext
                }
            }
        }
    });

    // create contextMenu

    function treeContextHandler(node) {
        node.select();
        if (node.attributes.type == "controller") {
            contextMenu.show(node.ui.getAnchor());
        }
    }    

    function deleteHandler(){
        Ext.Msg.confirm('Hey!', 'Do you want to delete this controller?', function(btn, text){
            if (btn == 'yes'){
                // go ahead and do more stuff
                tree.getSelectionModel().getSelectedNode().remove();
            } else {
        // abort, abort!
        }
        });
    }
    
    function debugHandler() {
        var node = tree.getSelectionModel().getSelectedNode();
        Ext.Msg.alert(node.id);
    }

    function showHandler() {
        //        alert("haha");
        var node =tree.getSelectionModel().getSelectedNode();
        var id = node.id;
        var ini_window = new Ext.Window({
            height: 600,
            width: 530,
            title: 'TestConfig.ini',
            items: [
            {
                xtype: 'ini_grid'
            }
            ]
            ,
            buttons: [
            {
                text: 'Save',
                handler: function() {
                    this.ownerCt.hide();
                }
            },
            {
                text: 'OK',
                handler: function() {
                    this.ownerCt.hide();
                }
            }
            
            ]
        //            html: '<h1>Oh</h1><p>HI THERE EVERYONE</p>'
        });

        //        ini_window.hide();
        
        config_store.reload({
            params: {
                machine_id: node.attributes.id
            },
            callback: function(r, options, success) {
                if (r) {
                    //                    alert('hadf')
                    ini_window.show();
                }else{
                    Ext.msg.alert('Fail', "cannot get test configuration for " + node.text);
                }                
            }
        });
        
    }

    function editHandler() {
        node = tree.getSelectionModel().getSelectedNode();
        Ext.Msg.alert(node.id);
    }

    function newHandler() {
        // Prompt for user data and process the result using a callback:
        Ext.Msg.prompt('New a test controller', 'Controller IP:', function(btn, text){
            if (btn == 'ok'){
                // process text value and close...
                Ext.Ajax.request({
                    url: 'plan/new_pmachine',
                    params: {
                        ip: text

                    },
                    callback :function(option,success,response){
                        if(success){//
                            Ext.Msg.alert('Success', text + ' added');
                            tree.getLoader().load(root);
                        }
                        Ext.Msg.alert('Fail', response.responseText);
                        return false;
                    }
                });
            }            
        });
    }

    function AddControllerHandler() {
        var movie_form = new Ext.FormPanel({
            url: 'plan/new_machine',
            renderTo: 'form_area',
            frame: true,
            title: 'Movie Information Form',
            width: 250,            
            items: [{
                xtype: 'textfield',
                fieldLabel: 'IP',
                name: 'ip'
            },{
                xtype: 'textfield',
                fieldLabel: 'owner',
                name: 'owner'
            },{
                xtype: 'datefield',
                fieldLabel: 'Released',
                name: 'released'
            }],
            buttons: [{
                text: 'Save',
                handler: function(){
                    movie_form.getForm().submit({
                        success: function(f,a){
                            Ext.Msg.alert('Success', 'It worked');
                        },
                        failure: function(f,a){
                            Ext.Msg.alert('Warning', 'Error');
                        }
                    });
                }
            }, {
                text: 'Reset',
                handler: function(){
                    movie_form.getForm().reset();
                }
            }]
        });
    }

    
    var contextMenu = new Ext.menu.Menu({
        items: [
        {
            text: 'Delete',
            handler: deleteHandler
        },
        {
            text: 'Debug',
            handler: debugHandler
        },
        {
            text: 'Edit Property',
            handler: editHandler
        },
        {
            text: 'Show Test Config',
            handler: showHandler
        },
        {
            text: 'New Test Controller',
            handler: newHandler
        //            handler: AddControllerHandler
        }
        ]
    });
    tree.on('contextmenu', treeContextHandler);

    

    

    //    tree.on('beforemovenode', function(t,node,oldParent,newParent,index) {
    //
    //        Ext.Ajax.requeset({
    //
    //            url: 'http://localhost/node-move.php',
    //            params: {
    //                nodeid: node.id,
    //                newparentid: newParent.id,
    //                oldparentid: oldParent.id,
    //                dropindex: index
    //            }
    //            ,
    //            callback :function(option,success,response){
    //                if(success){//
    //
    //                    return true;
    //                }
    //                return false;
    //            }
    //        });
    //
    //    });


    // }}}

    // create and show the window
    var win = new Ext.Panel({
        //		 title:Ext.getDom('plan-container').innerHTML
        title:"Module & Machine"
        ,
        id:'tree2divdrag'
        ,
        border:false
        ,
        layout:'border'
        ,
        width:700
        ,
        height:400
        ,
        renderTo:'plan-container'
        ,
        items:[tree, {
            xtype:'module-grid'
            ,
            id:'grid'
            ,
            title:'Module List'
            ,
            region:'center'
            ,
            layout:'fit'
            ,
            enableDragDrop:true
            ,
            ddGroup:'grid2tree'
        }]
    });



    //    theme = 'gray'
    //    Ext.util.CSS.swapStyleSheet("theme", "../../resources/css/xtheme-" + theme + ".css");
    win.show();


}); // eo function onReady

// eof
