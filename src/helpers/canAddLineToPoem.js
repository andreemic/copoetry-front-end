export default function canAddLineToPoem(poem, user) {
    try {
        return poem.lastContributor !== user.sub && !poem.completed;
    } catch(e) {
        return false;
    }
}
