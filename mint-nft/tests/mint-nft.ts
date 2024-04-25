import * as anchor from "@coral-xyz/anchor";
import { MintNft } from "../target/types/mint_nft";
import { AnchorProvider, setProvider } from '@coral-xyz/anchor';
import { clusterApiUrl, Connection } from '@solana/web3.js';
import { Keypair, sendAndConfirmTransaction } from '@solana/web3.js';

describe('mint-nft', async () => {
	const title = 'SkyTrade';
	const symbol = 'ST';
	const uri =
		'https://raw.githubusercontent.com/kiemtrann/mint-nfts-solana/main/uri.json';

  const mintKeypair: anchor.web3.Keypair = anchor.web3.Keypair.generate();
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  const owner = Keypair.fromSecretKey(
		Uint8Array.from([
			207, 10, 30, 18, 231, 158, 148, 233, 3, 79, 51, 28, 226, 14, 100, 105, 40,
			0, 21, 124, 124, 37, 49, 141, 113, 227, 15, 163, 144, 153, 110, 52, 85,
			113, 67, 66, 112, 198, 158, 22, 99, 2, 166, 247, 216, 182, 177, 142, 234,
			93, 67, 185, 207, 163, 44, 128, 109, 143, 105, 244, 159, 28, 46, 196,
		])
	);

  const providerWallet = new anchor.Wallet(Keypair.generate());

  const provider = new anchor.AnchorProvider(
    connection,
    providerWallet,
    AnchorProvider.defaultOptions()
  );

	setProvider(provider);

	const program = anchor.workspace.MintNft as anchor.Program<MintNft>;

	const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
		'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
	);

	it('mint nft', async () => {
		const tokenAddress = await anchor.utils.token.associatedAddress({
			mint: mintKeypair.publicKey,
			owner: owner.publicKey,
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
				mintAuthority: owner.publicKey,
				tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
			})
			.transaction();

    await sendAndConfirmTransaction(connection, tsx, [owner, mintKeypair]);
    console.log(tsx);
	});
});
