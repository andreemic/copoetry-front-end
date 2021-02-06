export default function canAddLineToPoem(poem, user) {
    try {
        return poem.lastContributor !== user.sub;
    } catch(e) {
        console.error("Error deciding whether user can add lines to a poem: " + e)
        return false;
    }
}
