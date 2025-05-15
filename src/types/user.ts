export interface UserProfile {
  userId: string;
  walletAddress: string;
  contractId: string;
  balanceXLM: string;
  email: string;
  createdAt: Date;
  lastLogin: Date;
  isDeleted?: boolean;
}

export interface CreateUserProfileDTO {
  userId: string;
  walletAddress: string;
  contractId: string;
  email: string;
}

export interface UpdateUserProfileDTO {
  balanceXLM?: string;
  lastLogin?: Date;
  walletAddress?: string;
  contractId?: string;
}
