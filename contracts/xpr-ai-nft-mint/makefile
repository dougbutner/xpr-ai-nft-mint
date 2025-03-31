TESTNET_CONTRACT_NAME = memeprinter
MAINNET_CONTRACT_NAME = mintme

CONTRACT_NAME = memeprinter

prepare:
	
	npm run build
	rm -rf ./deploy && mkdir deploy
	cd ./deploy && mkdir xpr-ai-nft-mint
	cd ./../../
	cd ./target && cp ./xpr-ai-nft-mint.contract.wasm ./../deploy/xpr-ai-nft-mint/xpr-ai-nft-mint.contract.wasm && cp ./xpr-ai-nft-mint.contract.abi ./../deploy/xpr-ai-nft-mint/xpr-ai-nft-mint.contract.abi

deploy-testnet:
	cd ./deploy/xpr-ai-nft-mint && proton chain:set proton-test && proton contract:set $(CONTRACT_NAME) ./ 

deploy-mainnet:
	cd ./deploy/xpr-ai-nft-mint && proton chain:set proton && proton contract:set $(CONTRACT_NAME) ./ 

feed-ram:
	proton chain:set proton-test && proton faucet:claim XPR $(CONTRACT_NAME) || echo "already claimed" && proton ram:buy $(CONTRACT_NAME) $(CONTRACT_NAME) 450000

push-testnet:
	make prepare && make deploy-testnet

push-mainnet:
	make prepare && make deploy-mainnet
