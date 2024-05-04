window.addEventListener('deadEvent', async () => {
    if (deadFlag && accountInfo) {
        console.log(accountInfo.walletAddress);
        //isSubmit = true;
        try {
           const rs = await startMatch(accountInfo.walletAddress);
           matchId = rs.Id;
           await endMatch(accountInfo.walletAddress, matchId, score, '');
        } catch (er) {
           console.log(er);
         }
        deadFlag = false;
     }
});