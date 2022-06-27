exports.anagram = async(req, res) => {
    try {
        let isAnagram = (str1, str2) => {
            let sorted1 = str1.split('').sort().join('').toLowerCase();
            let sorted2 = str2.split('').sort().join('').toLowerCase();
            return (sorted1 === sorted2)
        }

        const response = isAnagram(req.body.data, "twoString");
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message)
    }
}