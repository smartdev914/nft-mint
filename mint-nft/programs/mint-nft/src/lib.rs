use {
    anchor_lang::{
        prelude::*,
        solana_program::program::invoke,
        system_program,
    },
    anchor_spl::{
        associated_token,
        token,
    },
    mpl_token_metadata::{
        instructions::{
          CreateMetadataAccountV3,
          CreateMetadataAccountV3InstructionArgs,
          CreateMasterEditionV3
        },
    },
};

declare_id!("3B1E88qLCVqEuSzx9ToZwEd9SjDT3ZnD1xv3tr6iSjeS");

#[program]
pub mod mint_nft {
    use anchor_spl::token::spl_token;

    use super::*;

    pub fn mint(
      ctx: Context<MintNft>,
      title: String, 
      symbol: String, 
      uri: String
    ) -> Result<()> {
      system_program::create_account(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            system_program::CreateAccount {
                from: ctx.accounts.mint_authority.to_account_info(),
                to: ctx.accounts.mint.to_account_info(),
            },
        ),
        10000000,
        82,
        &ctx.accounts.token_program.key(),
      )?;

      token::initialize_mint(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::InitializeMint {
              mint: ctx.accounts.mint.to_account_info(),
              rent: ctx.accounts.rent.to_account_info(),
            },
        ),
        0,
        &ctx.accounts.mint_authority.key(),
        Some(&ctx.accounts.mint_authority.key()),
      )?;

      associated_token::create(
        CpiContext::new(
          ctx.accounts.associated_token_program.to_account_info(),
          associated_token::Create {
            payer: ctx.accounts.mint_authority.to_account_info(),
            associated_token: ctx.accounts.token_account.to_account_info(),
            authority: ctx.accounts.mint_authority.to_account_info(),
            mint: ctx.accounts.mint.to_account_info(),
            system_program: ctx.accounts.system_program.to_account_info(),
            token_program: ctx.accounts.token_program.to_account_info(),
          },
        ),
      )?;

      token::mint_to(
        CpiContext::new(
          ctx.accounts.token_program.to_account_info(),
          token::MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.token_account.to_account_info(),
            authority: ctx.accounts.mint_authority.to_account_info(),
          },
        ),
        1,
      )?;

      let metadata_account_instruction = CreateMetadataAccountV3 {
        metadata: ctx.accounts.metadata.key(),
        mint: ctx.accounts.mint.key(),
        mint_authority: ctx.accounts.mint_authority.key(),
        payer: ctx.accounts.mint_authority.key(),
        rent: None,
        system_program: system_program::ID,
        update_authority: (
            ctx.accounts.mint_authority.key(),
            false,
        ),
      }
      .instruction(
        CreateMetadataAccountV3InstructionArgs {
          collection_details: None,
          data: mpl_token_metadata::types::DataV2 {
            name: title,
            symbol: symbol,
            uri: uri,
            seller_fee_basis_points: 0,
            creators: None,
            collection: None,
            uses: None,
          },
          is_mutable: true,
        }
      );

      invoke(
        &metadata_account_instruction,
        &[
          ctx.accounts.metadata.to_account_info(),
          ctx.accounts.mint.to_account_info(),
          ctx.accounts.token_account.to_account_info(),
          ctx.accounts.mint_authority.to_account_info(),
          ctx.accounts.rent.to_account_info(),
        ],
      )?;
      
      let master_edition_account_instruction = CreateMasterEditionV3 { 
        edition: ctx.accounts.master_edition.key(),
        metadata: ctx.accounts.metadata.key(),
        mint: ctx.accounts.mint.key(),
        mint_authority: ctx.accounts.mint_authority.key(),
        payer: ctx.accounts.mint_authority.key(),
        rent: None,
        system_program: system_program::ID,
        token_program: spl_token::ID,
        update_authority: ctx.accounts.mint_authority.key(),
      }
      .instruction(
        mpl_token_metadata::instructions::CreateMasterEditionV3InstructionArgs { max_supply: None },
      );

      invoke(
        &master_edition_account_instruction,
        &[
          ctx.accounts.master_edition.to_account_info(),
          ctx.accounts.metadata.to_account_info(),
          ctx.accounts.mint.to_account_info(),
          ctx.accounts.token_account.to_account_info(),
          ctx.accounts.mint_authority.to_account_info(),
          ctx.accounts.rent.to_account_info(),
        ],
      )?;

      Ok(())
    }
}

#[derive(Accounts)]
pub struct MintNft<'info> {
    /// CHECK: 
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,
    /// CHECK: 
    #[account(mut)]
    pub master_edition: UncheckedAccount<'info>,
    #[account(mut)]
    pub mint: Signer<'info>,
    /// CHECK: 
    #[account(mut)]
    pub token_account: UncheckedAccount<'info>,
    #[account(mut)]
    pub mint_authority: Signer<'info>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, token::Token>,
    pub associated_token_program: Program<'info, associated_token::AssociatedToken>,
    /// CHECK:
    pub token_metadata_program: UncheckedAccount<'info>,
}
