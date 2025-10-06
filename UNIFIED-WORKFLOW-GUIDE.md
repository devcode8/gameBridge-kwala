# 🚀 Unified Kwala Workflow - Single Bridge Guide

## ✨ **One Workflow, All Badge Types**

This unified workflow captures **ONE event** from QuizProgress and intelligently routes it to mint **multiple badge types** based on conditions.

## 🎯 **How It Works**

```
┌─────────────────────────────────────────────────────────────────┐
│                    SINGLE KWALA WORKFLOW                        │
│                                                                 │
│  QuizProgress Contract                    SimpleBadgeMinter      │
│         │                                      Contract          │
│         │                                         │              │
│    1. User completes quiz                        │              │
│         │                                         │              │
│    2. Emits KwalaBadgeRequest ────────────────────┼──────────────┤
│         │                                         │              │
│         │                    Kwala Workflow       │              │
│         │                         │               │              │
│         │                    3. Catches event     │              │
│         │                         │               │              │
│         │                    4. Evaluates:        │              │
│         │                       • Score level     │              │
│         │                       • High score?     │              │
│         │                       • Perfect score?  │              │
│         │                       • First attempt?  │              │
│         │                         │               │              │
│         │                    5. Mints badges:     │              │
│         │                       ✓ Standard badge ─┼─► mintBadge()
│         │                       ✓ High score (if) ─┼─► mintBadgeWithCustomURI()
│         │                       ✓ Perfect (if) ───┼─► mintBadgeWithCustomURI()
│         │                       ✓ Welcome (if) ───┼─► mintBadgeWithCustomURI()
│         │                                         │              │
│    6. User receives all applicable badges ◄───────┘              │
└─────────────────────────────────────────────────────────────────┘
```

## 🎨 **Badge Logic**

| Condition | Badge Type | Function Called | Image |
|-----------|------------|-----------------|-------|
| **Always** | Standard Badge | `mintBadge()` | Based on score level |
| **If isHighScore = true** | High Score Badge | `mintBadgeWithCustomURI()` | winner.png |
| **If score = totalQuestions** | Perfect Score Badge | `mintBadgeWithCustomURI()` | 1.png (diamond) |
| **If isFirstAttempt = true** | Welcome Badge | `mintBadgeWithCustomURI()` | welcome.png |

### Example Scenarios:

**Scenario 1: New user gets 8/10 (first attempt)**
- ✅ Standard badge (score: 8, level: "Great")
- ✅ Welcome badge (first attempt)
- ❌ High score badge (not a high score yet)
- ❌ Perfect score badge (not 10/10)

**Scenario 2: User improves to 9/10**
- ✅ Standard badge (score: 9, level: "Excellent") 
- ✅ High score badge (improvement)
- ❌ Welcome badge (not first attempt)
- ❌ Perfect score badge (not 10/10)

**Scenario 3: User gets perfect 10/10**
- ✅ Standard badge (score: 10, level: "Perfect Score")
- ✅ High score badge (if improvement)
- ✅ Perfect score badge (diamond)
- ❌ Welcome badge (not first attempt)

## 🔧 **Deployment Steps**

### 1. Configure Contracts (Required First!)

**QuizProgress Contract:**
```solidity
// https://thirdweb.com/sepolia/0x7A323e9639fD722BaD3e22910A1b0EB3D4130492
setBadgeMinterContract("0x0aCc63313E429C6adc8853651DD63570670EFA8c")
```

**SimpleBadgeMinter Contract:**
```solidity
// https://thirdweb.com/sepolia/0x0aCc63313E429C6adc8853651DD63570670EFA8c
setKwalaOperator("0xDf6f8Ff02D4127e44F286b65A92d9125e8D50a07")
setQuizProgressContract("0x7A323e9639fD722BaD3e22910A1b0EB3D4130492")
```

### 2. Deploy Unified Workflow

```bash
# Upload kwala-unified-workflow.yml to Kwala platform
# This single file handles ALL badge minting scenarios
```

### 3. Test Complete Flow

```bash
# 1. Complete a quiz in your frontend
# 2. Check Sepolia events: https://sepolia.etherscan.io/address/0x7A323e9639fD722BaD3e22910A1b0EB3D4130492#events
# 3. Verify badges minted: https://sepolia.etherscan.io/address/0x0aCc63313E429C6adc8853651DD63570670EFA8c#events
# 4. Check user's wallet for NFT badges
```

## 📊 **Event Parameter Mapping**

```yaml
QuizProgress Event → SimpleBadgeMinter Function:
- event.user → to (recipient address)
- event.quizId → quizId (quiz identifier)  
- event.score → score (user's score)
- event.totalQuestions → totalQuestions (max possible score)
- event.badgeLevel → badgeLevel (computed level like "Great", "Excellent")
- event.isHighScore → isHighScore (boolean flag)
- event.isFirstAttempt → isFirstAttempt (boolean flag)
- event.timestamp → automatic timestamp
```

## 🎯 **Key Advantages**

### ✅ **Simplified Architecture**
- **ONE workflow** instead of 4 separate workflows
- **ONE event trigger** handles all scenarios
- **Conditional logic** routes to appropriate badge types

### ⚡ **Efficient Processing**
- Single event capture reduces overhead
- Parallel conditional execution
- Smart retry logic (3-5 retries per action)

### 🔄 **Intelligent Routing**
- Automatically detects perfect scores
- Recognizes first-time users
- Identifies score improvements
- Mints appropriate combination of badges

### 🛠 **Easy Maintenance**
- Single workflow to monitor
- Centralized configuration
- Unified error handling
- Simplified debugging

## 🧪 **Testing Checklist**

- [ ] **New User Test**: First quiz attempt → Standard + Welcome badges
- [ ] **Improvement Test**: Better score → Standard + High Score badges  
- [ ] **Perfect Score Test**: 10/10 score → Standard + Perfect + (High Score if improvement)
- [ ] **Regular Play Test**: Normal completion → Standard badge only
- [ ] **Error Handling Test**: Failed transactions retry properly
- [ ] **Performance Test**: Multiple users completing quizzes simultaneously

## 📈 **Monitoring**

### Single Dashboard View
Monitor one unified workflow instead of multiple:
- **Event Detection**: KwalaBadgeRequest events captured
- **Action Execution**: 4 conditional actions (some may skip based on conditions)
- **Success Rate**: Overall badge minting success percentage
- **Error Logs**: Centralized error tracking

### Key Metrics
- **Total Events Processed**: Number of quiz completions handled
- **Badge Distribution**: 
  - Standard badges: 100% (every completion)
  - Welcome badges: % of first-time users
  - High score badges: % of score improvements  
  - Perfect score badges: % of perfect scores

## 🎉 **Ready to Launch!**

Your unified Kwala workflow is now ready to:
- ✨ Catch **every quiz completion** with one event
- 🎯 **Intelligently decide** which badges to mint
- 🚀 **Automatically execute** multiple badge types
- 🔄 **Handle all scenarios** with conditional logic

**Deploy this single workflow and your quiz game will automatically mint the perfect combination of badges for every user! 🏆**