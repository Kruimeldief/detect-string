import { FilterBuilder } from "./filterBuilder.js";

enum Food {
  FRUIT,
  VEGETABLE,
  INEDIBLE
}

const fb = new FilterBuilder<Food>({
  allowMultipleCategories: true,
  confusablesByPackage: 'exclude',
  confusablesByUnicode: 'exclude',
  defaultCategory: Food.INEDIBLE,
  confusables: 'allow',
  defaultProfanityList: 'exclude',

});
fb.blacklist.add(['apple', 'banana'], Food.FRUIT)
  .add(['beans', 'tomato', 'potato'], Food.VEGETABLE)
  .add('apple', Food.VEGETABLE);
const f = fb.build();
console.log(f.search('apple', Food.FRUIT));