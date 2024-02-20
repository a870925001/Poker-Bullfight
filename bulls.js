let cards = []; // 存储用户选择的牌

function generateRandomCards() {
    const cardValues = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    cards = []; // 清空当前选择
    while (cards.length < 5) {
        const randomIndex = Math.floor(Math.random() * cardValues.length);
        cards.push(cardValues[randomIndex]);
    }
    updateSelectedCardsDisplay();
}

function addCard(card) {
    if (cards.length >= 5) {
        alert('已选择足够的牌');
        return;
    }
    cards.push(card);
    updateSelectedCardsDisplay();
}

function clearCards() {
    cards = [];
    updateSelectedCardsDisplay();
    document.getElementById('result').innerText = '';
}

function updateSelectedCardsDisplay() {
    document.getElementById('selectedCards').innerText = cards.join(', ');
}

function calculateBull() {
    if (cards.length !== 5) {
        alert('请选取五张牌');
        return;
    }

    const numCards = cards.map(card => {
        if (card === 'A') return 1;
        if (['J', 'Q', 'K'].includes(card)) return 10;
        return parseInt(card);
    });

    let combinations = []; // 存储所有可能的组合及其点数

    // 尝试每种3和6的变换组合
    for (let mask = 0; mask < (1 << 5); ++mask) {
        let tempCards = numCards.slice();
        let tempCardFaces = cards.slice(); // 用于显示的牌面
        for (let i = 0; i < 5; ++i) {
            if (tempCards[i] === 3 && (mask & (1 << i))) {
                tempCards[i] = 6;
                tempCardFaces[i] = '3(变6)';
            } else if (tempCards[i] === 6 && (mask & (1 << i))) {
                tempCards[i] = 3;
                tempCardFaces[i] = '6(变3)';
            }
        }

        // 计算当前组合的牛牛点数
        let result = calculateBullForCombination(tempCards);
        if (result !== null) {
            combinations.push({cards: tempCardFaces.join(', '), result: `牛${result}`});
        }
    }

    // 去重并排序
    let uniqueCombinations = combinations.filter((value, index, self) =>
        index === self.findIndex((t) => t.cards === value.cards && t.result === value.result)
    );

    // 显示结果
    let resultElement = document.getElementById('result');
    if (uniqueCombinations.length > 0) {
        resultElement.innerHTML = uniqueCombinations.map(comb => `${comb.cards}: ${comb.result}`).join('<br>');
    } else {
        resultElement.innerText = '无牛';
    }
}

function calculateBullForCombination(cards) {
    let hasBull = false;
    let bullValue = 0;
    outerLoop:
    for (let i = 0; i < cards.length - 2; i++) {
        for (let j = i + 1; j < cards.length - 1; j++) {
            for (let k = j + 1; k < cards.length; k++) {
                let sumThree = cards[i] + cards[j] + cards[k];
                if (sumThree % 10 === 0) {
                    let otherTwoSum = cards.reduce((acc, val, idx) => acc + (idx === i || idx === j || idx === k ? 0 : val), 0);
                    bullValue = otherTwoSum % 10;
                    hasBull = true;
                    break outerLoop;
                }
            }
        }
    }
    return hasBull ? (bullValue === 0 ? 10 : bullValue) : null;
}

clearCards();
