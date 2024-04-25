use anchor_lang::prelude::*;

declare_id!("3B1E88qLCVqEuSzx9ToZwEd9SjDT3ZnD1xv3tr6iSjeS");

#[program]
pub mod mint_nft {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
