/*
 * Copyright (c) 2017 VMware, Inc. All Rights Reserved.
 *
 * This product is licensed to you under the Apache License, Version 2.0 (the "License").
 * You may not use this product except in compliance with the License.
 *
 * This product may include a number of subcomponents with separate copyright notices
 * and license terms. Your use of these subcomponents is subject to the terms and
 * conditions of the subcomponent's license, as noted in the LICENSE file.
 */

package com.vmware.admiral.vic.test.ui.projects;

import org.junit.Test;

import com.vmware.admiral.test.ui.pages.projects.ProjectsPage;
import com.vmware.admiral.vic.test.ui.BaseTest;

/**
 * This test verifies that a project is successfully created when the name is valid
 *
 */
public class CreateProjectPositive extends BaseTest {

    private final String PROJECT_NAME = "test_project";

    @Test
    public void testCreateProjectSucceeds() {
        loginAsAdmin();
        ProjectsPage projectsPage = navigateToAdministrationTab()
                .navigateToProjectsPage();
        projectsPage.addProject()
                .setName(PROJECT_NAME)
                .setDescription(PROJECT_NAME)
                .submit()
                .expectSuccess();
        projectsPage.validate().validateProjectIsVisible(PROJECT_NAME);
        navigateToHomeTab().validate()
                .validateProjectIsAvailable(PROJECT_NAME);
        navigateToAdministrationTab().navigateToProjectsPage();
        projectsPage.validate(v -> v.validateProjectIsVisible(PROJECT_NAME))
                .deleteProject(PROJECT_NAME)
                .expectSuccess();
        logOut();
    }

}
