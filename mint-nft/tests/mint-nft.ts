import * as anchor from "@coral-xyz/anchor";
import { MintNft } from "../target/types/mint_nft";
describe('mint-nft', async () => {
	const title = 'SkyTrade';
	const symbol = 'ST';
	const uri =
		'https://raw.githubusercontent.com/kiemtrann/mint-nfts-solana/main/uri.json';

	const provider = anchor.AnchorProvider.env();
	const wallet = provider.wallet as anchor.Wallet;
	anchor.setProvider(provider);

	const program = anchor.workspace.MintNft as anchor.Program<MintNft>;

	const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
		'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
	);

	it('mint nft', async () => {
		const mintKeypair: anchor.web3.Keypair = anchor.web3.Keypair.generate();
		const tokenAddress = await anchor.utils.token.associatedAddress({
			mint: mintKeypair.publicKey,
			owner: wallet.publicKey,
		});

		const metadataAddress = (
			await anchor.web3.PublicKey.findProgramAddress(
				[
					Buffer.from('metadata'),
					TOKEN_METADATA_PROGRAM_ID.toBuffer(),
					mintKeypair.publicKey.toBuffer(),
				],
				TOKEN_METADATA_PROGRAM_ID
			)
		)[0];

		const masterEditionAddress = (
			await anchor.web3.PublicKey.findProgramAddress(
				[
					Buffer.from('metadata'),
					TOKEN_METADATA_PROGRAM_ID.toBuffer(),
					mintKeypair.publicKey.toBuffer(),
					Buffer.from('edition'),
				],
				TOKEN_METADATA_PROGRAM_ID
			)
		)[0];

		const tsx = await program.methods
			.mint(title, symbol, uri)
			.accounts({
				masterEdition: masterEditionAddress,
				metadata: metadataAddress,
				mint: mintKeypair.publicKey,
				tokenAccount: tokenAddress,
				mintAuthority: wallet.publicKey,
				tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
			})
			.signers([mintKeypair])
			.rpc();

    console.log(tsx);
	});
});
