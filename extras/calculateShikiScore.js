function calculateAverageScore(scoresStats) {
    let sum = 0;
    let totalCount = 0;

    // Iterate through each entry in scoresStats
    scoresStats.forEach(entry => {
        // Multiply the score by its count and add to the sum
        sum += entry.score * entry.count;
        // Add the count to the total count
        totalCount += entry.count;
    });

    // Calculate the average score
    const averageScore = sum / totalCount;
    
    return averageScore;
}

export default calculateAverageScore;