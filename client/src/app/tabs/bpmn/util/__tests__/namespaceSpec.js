/**
 * Copyright (c) Camunda Services GmbH.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import namespaceUtil from '../namespace';

import diagram from './fixtures/diagram.bpmn';
import activiti from './fixtures/activiti.xml';
import activitiExpected from './fixtures/activitiExpected.xml';
import activitiCamunda from './fixtures/activitiCamunda.xml';
import activitiCamundaExpected from './fixtures/activitiCamundaExpected.xml';
import activitiComplex from './fixtures/activitiComplex.xml';
import activitiComplexExpected from './fixtures/activitiComplexExpected.xml';


const NAMESPACE_URL_ACTIVITI = 'http://activiti.org/bpmn';
const NAMESPACE_URL_CAMUNDA = 'http://camunda.org/schema/1.0/bpmn';
const CAMUNDA_PREFIX = 'camunda';

describe('util - namespace', function() {

  describe('findNamespace', function() {

    it('should return { ["activiti"], targetNamespace: true } for activiti diagram', function() {
      // when
      const { prefixes, targetNamespace } = namespaceUtil.find(activiti, NAMESPACE_URL_ACTIVITI);

      // then
      expect(prefixes).to.be.eql(['activiti']);
      expect(targetNamespace).to.be.true;
    });


    it('should return { [], targetNamespace: true } when namespace is found only as target', function() {
      // when
      const { prefixes, targetNamespace } = namespaceUtil.find(activitiCamunda, NAMESPACE_URL_ACTIVITI);

      // then
      expect(prefixes).to.be.eql([]);
      expect(targetNamespace).to.be.true;
    });


    it('should return { [], targetNamespace: false } when namespace is not found', function() {
      // when
      const { prefixes, targetNamespace } = namespaceUtil.find(diagram, NAMESPACE_URL_ACTIVITI);

      // then
      expect(prefixes).to.be.eql([]);
      expect(targetNamespace).to.be.false;
    });


    it('should return { [], targetNamespace: false } when error occurs', function() {
      // when
      const { prefixes, targetNamespace } = namespaceUtil.find('error>', NAMESPACE_URL_ACTIVITI);

      // then
      expect(prefixes).to.be.eql([]);
      expect(targetNamespace).to.be.false;
    });

  });


  describe('find and replace', function() {

    it('should find and replace Activiti namespace with camunda', function() {

      // given
      const [ beforeConversion, expected ] = [ activiti, activitiExpected ];

      // when
      const { prefixes } = namespaceUtil.find(beforeConversion, NAMESPACE_URL_ACTIVITI);

      const result = namespaceUtil.replace(beforeConversion, {
        oldPrefixes: prefixes,
        newPrefix: CAMUNDA_PREFIX,
        oldNamespaceUrl: NAMESPACE_URL_ACTIVITI,
        newNamespaceUrl: NAMESPACE_URL_CAMUNDA
      });

      // then
      expect(result).to.equal(expected);
    });


    it('should not replace camunda prefix', function() {

      // given
      const [ beforeConversion, expected ] = [ activitiCamunda, activitiCamundaExpected ];

      // when
      const { prefixes } = namespaceUtil.find(beforeConversion, NAMESPACE_URL_ACTIVITI);

      const result = namespaceUtil.replace(beforeConversion, {
        oldPrefixes: prefixes,
        newPrefix: CAMUNDA_PREFIX,
        oldNamespaceUrl: NAMESPACE_URL_ACTIVITI,
        newNamespaceUrl: NAMESPACE_URL_CAMUNDA
      });

      // then
      expect(result).to.equal(expected);
    });


    it('should find and replace Activiti namespace with camunda for complex diagram', function() {

      // given
      const [ beforeConversion, expected ] = [ activitiComplex, activitiComplexExpected ];

      // when
      const { prefixes } = namespaceUtil.find(beforeConversion, NAMESPACE_URL_ACTIVITI);

      const result = namespaceUtil.replace(beforeConversion, {
        oldPrefixes: prefixes,
        newPrefix: CAMUNDA_PREFIX,
        oldNamespaceUrl: NAMESPACE_URL_ACTIVITI,
        newNamespaceUrl: NAMESPACE_URL_CAMUNDA
      });

      // then
      expect(result).to.equal(expected);
    });

  });

});
