/**
 * Unipile API - LinkedIn Users Response Cleaners
 * 
 * This file contains functions for cleaning and formatting LinkedIn user responses
 * from the Unipile API to make them suitable for feeding to an LLM.
 */

/**
 * Clean and format a user profile response
 * 
 * @param userProfile - The raw user profile response from the API
 * @returns A cleaned and formatted user profile
 */
export function cleanUserProfile(userProfile: any): any {
  if (!userProfile) return null;

  return {
    firstName: userProfile.first_name,
    lastName: userProfile.last_name,
    fullName: `${userProfile.first_name} ${userProfile.last_name}`,
    headline: userProfile.headline,
    location: userProfile.location,
    profilePictureUrl: userProfile.profile_picture_url_large || userProfile.profile_picture_url,
    publicIdentifier: userProfile.public_identifier,
    providerId: userProfile.provider_id,
    memberUrn: userProfile.member_urn,
    followerCount: userProfile.follower_count,
    connectionsCount: userProfile.connections_count,
    isPremium: userProfile.is_premium,
    isInfluencer: userProfile.is_influencer,
    isCreator: userProfile.is_creator
  };
}

/**
 * Clean and format account owner profile response
 * 
 * @param accountOwnerProfile - The raw account owner profile response from the API
 * @returns A cleaned and formatted account owner profile
 */
export function cleanAccountOwnerProfile(accountOwnerProfile: any): any {
  if (!accountOwnerProfile) return null;
  
  const baseProfile = cleanUserProfile(accountOwnerProfile);
  
  return {
    ...baseProfile,
    providerId: accountOwnerProfile.provider_id,
    entityUrn: accountOwnerProfile.entity_urn
  };
}

/**
 * Clean and format user relations response
 * 
 * @param relations - The raw user relations response from the API
 * @returns Cleaned and formatted user relations
 */
export function cleanUserRelations(relations: any): any {
  if (!relations || !relations.items) return { connections: [] };

  return {
    connections: relations.items.map((connection: any) => ({
      firstName: connection.first_name,
      lastName: connection.last_name,
      fullName: `${connection.first_name} ${connection.last_name}`,
      headline: connection.headline,
      profilePictureUrl: connection.profile_picture_url,
      publicIdentifier: connection.public_identifier,
      publicProfileUrl: connection.public_profile_url,
      connectionDegree: connection.connection_degree,
      // Important identifiers for API calls
      memberId: connection.member_id,
      memberUrn: connection.member_urn,
      connectionUrn: connection.connection_urn,
      createdAt: connection.created_at
    }))
  };
}

/**
 * Clean and format invitations received response
 * 
 * @param invitations - The raw invitations received response from the API
 * @returns Cleaned and formatted invitations received
 */
export function cleanInvitationsReceived(invitations: any): any {
  if (!invitations || !invitations.items) return { invitations: [] };

  return {
    invitations: invitations.items.map((invitation: any) => ({
      id: invitation.id,
      sharedSecret: invitation.shared_secret,
      message: invitation.message,
      sentAt: invitation.sent_at,
      sender: invitation.sender ? {
        firstName: invitation.sender.first_name,
        lastName: invitation.sender.last_name,
        fullName: `${invitation.sender.first_name} ${invitation.sender.last_name}`,
        headline: invitation.sender.headline,
        profilePictureUrl: invitation.sender.profile_picture_url
      } : null
    }))
  };
}

/**
 * Clean and format invitations sent response
 * 
 * @param invitations - The raw invitations sent response from the API
 * @returns Cleaned and formatted invitations sent
 */
export function cleanInvitationsSent(invitations: any): any {
  if (!invitations || !invitations.items) return { invitations: [] };

  return {
    invitations: invitations.items.map((invitation: any) => ({
      id: invitation.id,
      sharedSecret: invitation.shared_secret,
      message: invitation.message,
      sentAt: invitation.sent_at,
      recipient: invitation.recipient ? {
        firstName: invitation.recipient.first_name,
        lastName: invitation.recipient.last_name,
        fullName: `${invitation.recipient.first_name} ${invitation.recipient.last_name}`,
        headline: invitation.recipient.headline,
        profilePictureUrl: invitation.recipient.profile_picture_url
      } : null
    }))
  };
}

/**
 * Clean and format send invitation response
 * 
 * @param sendInvitationResponse - The raw send invitation response from the API
 * @returns Cleaned and formatted send invitation response
 */
export function cleanSendInvitationResponse(sendInvitationResponse: any): any {
  if (!sendInvitationResponse) return null;

  return {
    success: true,
    object: sendInvitationResponse.object,
    invitationId: sendInvitationResponse.invitation_id
  };
}