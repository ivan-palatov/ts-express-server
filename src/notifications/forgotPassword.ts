export const forgotPasswordOptions = (to: string, actCode: string, siteAddress: string): any => {
  return {
    to,
    subject: "Confirm your email.",
    text: `You recieved this message because someone used this email to register on ${siteAddress} . 
      If it wasn't you, just ignore this message. If it was you, please follow this link: 
      ${siteAddress}/activate/${actCode}`,
    html: ``
  };
};
