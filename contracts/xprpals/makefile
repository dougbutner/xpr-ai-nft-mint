prepare:
	echo $(date)
	npm run build
	rm -rf ./deploy && mkdir deploy
	cd ./deploy && mkdir xprpals
	cd ./../../
	cd ./target && cp ./xprpals.contract.wasm ./../deploy/xprpals/xprpals.contract.wasm && cp ./xprpals.contract.abi ./../deploy/xprpals/xprpals.contract.abi

deploy-testnet:
	cd ./deploy/xprpals && proton chain:set proton-test && proton contract:set xprpals ./ 

deploy-mainnet:
	cd ./deploy/xprpals && proton chain:set proton && proton contract:set mintme ./ 

feed-ram:
	proton chain:set proton-test && proton faucet:claim XPR xprpals || echo "already claimed" && proton ram:buy xprpals xprpals 450000

testnet:
	make prepare && make deploy-testnet

publish:
	make prepare && make deploy-mainnet