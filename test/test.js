let assert = require('assert');
const BTCPromise = require('bitcoin-promise');
const Client = require('bitcoin-core');
const client = new Client({ 
    port: 19119,
    network:"testnet",

    username: 'yourusername'
    // password: 'defaul'

});


const client2 = new BTCPromise.Client({
	host: 'localhost',
    port: 19119,
    user: 'sample1',
    pass: 'sample2',
});

client2.getInfo().then(info => console.log(info.balance));


const batch = [
                { method: 'getinfo', parameters: [] }
            ]

            client.command(batch).then((responses) => console.log(responses));

// client2.getNewAddress().then(function(addr){
//     console.log(addr);
// })

// const batch = [
//     { method: 'getnewaddress', parameters: ['myaccount'] }
// ]

// client.command(batch).then((responses, err) => console.log(responses, err));


describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});

describe('RPC', function(){
    describe('Client Connect', function(){
        it("should return a non-null value when we\'re able to connect to bitcoin", function(){
            client.getInfo().then((help) => {
                console.log(help)
                let thehelp = help || null;
                assert.notEqual(null, thehelp);
            });
            // Not null
            // assert.equal(true, true)
        });
    });


    // describe('Get a new address', function(){
    //     it("should return a new address", function(){
    //         const batch = [
    //             { method: 'getnewaddress', parameters: [] }
    //         ]

    //         client.command(batch).then((responses, err) => console.log(responses, err));

    //         // client2.getNewAddress().then(function(addr, err){
    //         //     console.log(addr, err);
    //         // })
    //         // client.command('getBlock').then((res)=>{
    //         //     console.log(res);
    //         // })
    //         // client.command('getnewaddress').then((address, err)=>{
    //         //     console.log(address, error);
    //         // })
    //     })
    // });


});
